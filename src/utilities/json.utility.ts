import { JsonObject, Optional } from "../types/common.types";

export function parseSafe<T=JsonObject, U = unknown>(str: string, defaultValue: any): T | U {
    try {
        return JSON.parse(str);
    } catch (e) {
        // @todo: log
        return defaultValue;
    }
}