import StoreContract from "../core/StoreContract";
import { MysqlManager } from "../database/mysql.db";
import { Config, JsonObject } from "../types/common.types";
import { ConfigModel } from "../types/mysql.schema";
import { parseSafe } from "../utilities/json.utility";
import configEventEmitter from "../core/ConfigEventEmitter";

export default class MysqlStore extends StoreContract {
    private manager: MysqlManager;
    
    constructor(manager: MysqlManager, options: {
        pollIntervalInSeconds: number
    }) {
        super()
        this.manager = manager;

        const pollIntervalInSeconds = options.pollIntervalInSeconds > 0 ? options.pollIntervalInSeconds : 10;

        setInterval(async () => {
            const results = await this.fetchChangedConfigs(pollIntervalInSeconds);
            configEventEmitter.emitConfigUpdated(results);
        }, pollIntervalInSeconds * 1000);
    }

    async fetchConfig(input: { appId: string, env: string, version: string }) {
        const { appId, env, version } = input;
        const results = await this.manager.execute<Pick<ConfigModel, "config">[]>({
            sql: `SELECT config FROM configs WHERE appId = ? AND env = ? AND version = ?`,
            values: [appId, env, version]
        });
        return Array.isArray(results) && results.length > 0 ? parseSafe<Config, null>(results[0].config, null) : null;
    }

    async fetchChangedConfigs(timeInSeconds: number) {
        const results = await this.manager.execute<Omit<ConfigModel, "id" | "updatedAt">[]>({
            sql: `SELECT appId, env, version, config FROM configs WHERE updatedAt >= NOW() - INTERVAL ? SECOND`,
            values: [timeInSeconds]
        });

        return results.map((config) => ({
            ...config,
            config: parseSafe<Config, JsonObject>(config.config, {})
        }));
    }
}