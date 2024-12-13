import { JsonObject, Optional } from "../types/common.types";

export function parseSafe<T=JsonObject, U=unknown>(str: string, defaultValue: U): T | U {
    try {
        return JSON.parse(str);
    } catch (e) {
        // @todo: log
        console.log("parseSafe err", str, defaultValue, e)
        return defaultValue;
    }
}