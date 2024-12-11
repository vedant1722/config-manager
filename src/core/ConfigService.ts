import { JsonKeyValue, Optional } from "../types/common.types";
import LocalCache from "./LocalCache";
import StoreContract from "./StoreContract";

export default class ConfigService {
    protected store: StoreContract;
    protected localCache: LocalCache;

    constructor(
        store: StoreContract,
        localCache: LocalCache,
    ) {
        this.store = store;
        this.localCache = localCache;
    }

    private async updateCacheConfig(input: {
        appId: string, env: string, version: string
    }) {
        const { appId, env, version } = input;
        const config = await this.store.fetchConfig({ appId, env, version });
        if (!config) {
            throw new Error(`Config not found for appId: ${appId}, env: ${env}, version: ${version}`);
        }
        this.localCache.setLocalConfig({ appId, env, version }, config);
    }

    async findOrUpdateCache(input: {
        appId: string, env: string, version: string, jsonQuery: string
    }): Promise<Optional<JsonKeyValue>> {
        const { appId, env, version, jsonQuery } = input;
        let cached = this.localCache.get({ appId, env, version, jsonQuery });

        if(!cached) {
            await this.updateCacheConfig({ appId, env, version });
            cached = this.localCache.get({ appId, env, version, jsonQuery });
        }

        return cached;
    }

    public async get(input: {
        appId: string, env: string, version: string, key: string
    }) {
        const { appId, env, version, key } = input;
        return await this.findOrUpdateCache({ appId, env, version, jsonQuery: key });
    }

    public async getMany({ appId, env, version, keys }: { appId: string, env: string, version: string,  keys: string[] }) {
        const output: { [key: string]: JsonKeyValue } = {};
        for(const key of keys) {
            const value = await this.get({ appId, env, version, key });
            value !== undefined && (output[key] = value);
        }

        return output;
    }
}