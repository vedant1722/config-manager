import { Config } from "./common.types";

export type LocalConfig = Config;

export type AppEnvironmentLocalCache = {
    [version: string]: LocalConfig;
}

export type AppLocalCache = {
    [environment: string]: AppEnvironmentLocalCache;
}

export type LocalCacheObject = {
    [appId: string]: AppLocalCache;
}
