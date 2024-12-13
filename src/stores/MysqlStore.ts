import StoreContract from "../core/StoreContract";
import { MysqlManager } from "../database/mysql.db";
import { ConfigModel } from "../types/mysql.schema";
import container from "../core/container";

export default class MysqlStore extends StoreContract {
    private manager: MysqlManager;
    
    constructor(manager: MysqlManager, options: {
        pollIntervalInSeconds: number
    }) {
        super()
        this.manager = manager;

        const pollIntervalInSeconds = options.pollIntervalInSeconds > 0 ? options.pollIntervalInSeconds : 10;

        setInterval(async () => {
            const results = await this.fetchChangedConfigDetails(pollIntervalInSeconds);
            container.cradle.configEventEmitter.emitConfigUpdated(results);
        }, pollIntervalInSeconds * 1000);
    }

    async fetchConfig(input: { appId: string, env: string, version: string }) {
        const { appId, env, version } = input;
        const results = await this.manager.execute<Pick<ConfigModel, "config">[]>({
            sql: `SELECT config FROM configs WHERE appId = ? AND env = ? AND version = ?`,
            values: [appId, env, version]
        });
        return Array.isArray(results) && results.length > 0 ? results[0].config : null;
    }

    async fetchChangedConfigDetails(timeInSeconds: number) {
        const results = await this.manager.execute<Pick<ConfigModel, "appId" | "env" | "version">[]>({
            sql: `SELECT appId, env, version FROM configs WHERE updatedAt >= NOW() - INTERVAL ? SECOND`,
            values: [timeInSeconds]
        });

        return results;
    }
}