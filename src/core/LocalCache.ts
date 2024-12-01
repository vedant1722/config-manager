import { Config } from "../types/common.types";
import { LocalCacheObject, LocalConfig } from "../types/localCache.types";

export default class LocalCache {
    protected cache: LocalCacheObject;

    constructor() {
        this.cache = {};
    }

    public setLocalConfig(input: {
        appId: string, env: string, version: string
    }, config: Config) {
        const { appId, env, version } = input;
        
        if(!this.cache[appId]) {
            this.cache[appId] = {};
        }

        if(!this.cache[appId][env]) {
            this.cache[appId][env] = {};
        }

        this.cache[appId][env][version] = config;
    }

    public get(input: {
        appId: string, env: string, version: string, jsonQuery: string
    }) {
        const { appId, env, version, jsonQuery } = input;
        const config = this.cache[appId][env][version] || null;

        if(!config) {
            return undefined;
        }

        /**
         * @todo implement json query to get nested keys
         */
        return config[jsonQuery];
    }
}

const localCache = new LocalCache();
export { localCache };