import { asClass, asValue, createContainer, InjectionMode } from "awilix";
import LocalCache from "./LocalCache";
import ConfigEventEmitter from "./ConfigEventEmitter";
import StoreContract from "./StoreContract";
import ConfigService from "./ConfigService";
import { $AppConfig } from "../types/appConfig.types";
import { getAppConfig } from "../config";
import makeStore from "../factory/store.factory";

type Cradle = {
    config: $AppConfig,
    configEventEmitter: ConfigEventEmitter,
    localCache: LocalCache,
    store: StoreContract,
    configService: ConfigService,
};

const container = createContainer<Cradle>({
    injectionMode: InjectionMode.CLASSIC
});

export async function initializeContainer() {
    const config = getAppConfig();
    const store = await makeStore(config);
    container.register({
        config: asValue(config),
        store: asValue(store),  // singleton
        localCache: asClass(LocalCache).classic().singleton(),
        configEventEmitter: asClass(ConfigEventEmitter).classic().singleton(),
        configService: asClass(ConfigService).classic().singleton()
    })
}

export default container;