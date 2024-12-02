import { Config, Nullable } from "../types/common.types";
import { LocalConfig } from "../types/localCache.types";

export default abstract class StoreContract {
    abstract fetchConfig(input: { appId: string, env: string, version: string }): Promise<Nullable<LocalConfig>>;
    abstract fetchChangedConfigs(timeInSeconds: number): Promise<{ appId: string, env: string, version: string, config: Config }[]>;
}