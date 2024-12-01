import { Config } from "../types/common.types";

export default abstract class StoreContract {
    abstract fetchConfig(input: { appId: string, env: string, version: string }): Promise<Config>;
}