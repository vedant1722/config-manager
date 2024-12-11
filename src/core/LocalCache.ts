import { Config } from "../types/common.types";
export default class LocalCache {
    protected keySeparator = "|"
    protected cache: Map<string, Config>;

    constructor() {
        this.cache = new Map();
    }

    makeKey({ appId, env, version }: {
        appId: string,
        env: string,
        version: string
    }) {
        return `a:${appId}${this.keySeparator}e:${env}${this.keySeparator}v:${version}`;
    }

    public setLocalConfig(input: {
        appId: string, env: string, version: string
    }, config: Config) {
        const { appId, env, version } = input;

        const key = this.makeKey({ appId, env, version });
        this.cache.set(key, config);
    }

    public setManyLocalConfigs(data: {
        appId: string, env: string, version: string, config: Config
    }[]) {
        for(const { appId, env, version, config } of data) {
            this.setLocalConfig({ appId, env, version }, config);
        }
    }

    public get(input: {
        appId: string, env: string, version: string, jsonQuery: string
    }) {
        const { appId, env, version, jsonQuery } = input;
        const key = this.makeKey({ appId, env, version });
        const config = this.cache.get(key) || null;

        if(!config) {
            return undefined;
        }

        /**
         * @todo implement json query to get nested keys
         */
        return config[jsonQuery];
    }
}