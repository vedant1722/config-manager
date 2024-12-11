import { Config, Nullable } from "../types/common.types";

export default abstract class StoreContract {
    abstract fetchConfig(input: { appId: string, env: string, version: string }): Promise<Nullable<Config>>;
    abstract fetchChangedConfigs(timeInSeconds: number): Promise<{ appId: string, env: string, version: string, config: Config }[]>;
}