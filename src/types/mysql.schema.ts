import { JsonObject } from "./common.types"

export type ConfigModel = {
    id: string,
    appId: string,
    env: string,
    version: string,
    config: JsonObject,
    updatedAt: Date
}