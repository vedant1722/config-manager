import { JsonKeyValue } from "../types/common.types";

export default class LocalCache {
    protected cache: Map<string, JsonKeyValue>;

    constructor() {
        this.cache = new Map();
    }

    public setLocalConfig(key: string, val: JsonKeyValue) {
        this.cache.set(key, val);
    }

    public setManyLocalConfigs(data: {
        key: string, val: JsonKeyValue
    }[]) {
        for(const { key, val } of data) {
            this.setLocalConfig(key, val);
        }
    }

    public delete(key: string) {
        this.cache.delete(key);
    }

    public deleteMany(keys: string[]) {
        for(const key of keys) {
            this.delete(key);
        }
    }

    public get<T=JsonKeyValue>(key: string) {
        const val = this.cache.get(key) || null;

        if(!val) {
            return undefined;
        }

        return val as T;
    }
}