import { createContainer, InjectionMode } from "awilix";
import LocalCache from "./LocalCache";
import ConfigEventEmitter from "./ConfigEventEmitter";
import StoreContract from "./StoreContract";
import ConfigService from "./ConfigService";
import { $AppConfig } from "../types/appConfig.types";

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

export default container;