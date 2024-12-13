import { JsonKeyValue, JsonObject, Optional } from "../types/common.types";
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

    protected keySeparator = "|";

    makeKey({ appId, env, version }: {
        appId: string,
        env: string,
        version: string
    }) {
        return `a:${appId}${this.keySeparator}e:${env}${this.keySeparator}v:${version}`;
    }

    private async updateCacheConfig(input: {
        appId: string, env: string, version: string
    }) {
        const { appId, env, version } = input;
        const config = await this.store.fetchConfig({ appId, env, version });
        if (!config) {
            throw new Error(`Config not found for appId: ${appId}, env: ${env}, version: ${version}`);
        }

        const key = this.makeKey({ appId, env, version });
        this.localCache.setLocalConfig(key, config);
    }

    async findOrUpdateCache(input: {
        appId: string, env: string, version: string, jsonQuery: string
    }): Promise<Optional<JsonKeyValue>> {
        const { appId, env, version, jsonQuery } = input;
        const key = this.makeKey({ appId, env, version });
        let config = this.localCache.get<JsonObject>(key);

        if(!config) {
            await this.updateCacheConfig({ appId, env, version });
            config = this.localCache.get<JsonObject>(key);
        }

        /**
         * @todo implement json query to get nested keys
         */
        return config ? config[jsonQuery]: undefined;
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

    async handleConfigsUpdatedEvent(configs: { appId: string, env: string, version: string }[]) {
        for(const { appId, env, version } of configs) {
            const key = this.makeKey({ appId, env, version });
            this.localCache.delete(key);
        }
    }
}