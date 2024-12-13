import { Client } from "pg";
import container from "../core/container";
import StoreContract from "../core/StoreContract";
import { PostgresManager } from "../database/postgres.db";
import { JsonObject } from "../types/common.types";
import { parseSafe } from "../utilities/json.utility";

const CONFIG_UPDATED_CHANNEL = 'config_updated_channel';

export default class PostgreStore extends StoreContract {
    private manager: PostgresManager;

    constructor(manager: PostgresManager) {
        super();

        this.manager = manager;
    }

    private listnerClient: Client | null = null;

    async registerConfigUpdatedListner() {
        if (this.listnerClient) {
            return;
        }
    
        const client = await this.manager.getClient();

        await client.query(`LISTEN ${CONFIG_UPDATED_CHANNEL}`);

        client.on('notification', (message) => {
            if (message.channel === CONFIG_UPDATED_CHANNEL) {
                try {
                    console.log('msg', message);
                    const data = parseSafe<{ appId: string, env: string, version: string }, null>(message.payload as string, null);
                    if(!data) {
                        // todo: log
                        console.error("config updated message parse error", message);
                        return;
                    }
                    container.cradle.configEventEmitter.emitConfigUpdated([data]);
                } catch (error) {
                    // todo: log
                    console.error("config updated message parse error", message, error);
                }
            }
        });

        this.listnerClient = client;
    }

    async fetchConfig(input: { appId: string, env: string, version: string }) {
        const { appId, env, version } = input;
        const results = await this.manager.execute<{ config: JsonObject }>({
            sql: `SELECT config FROM configs WHERE "appId" = $1 AND env = $2 AND version = $3`,
            values: [appId, env, version]
        })

        return Array.isArray(results) && results.length > 0 ? results[0].config : null;
    }
}