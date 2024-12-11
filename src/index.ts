import dotenv from "dotenv";
dotenv.config();

import ConfigService from "./core/ConfigService";
import LocalCache from "./core/LocalCache";
import makeStore from "./factory/store.factory";
import container from "./core/container";
import { asClass, asFunction } from "awilix";
import ConfigEventEmitter from "./core/ConfigEventEmitter";
import { getAppConfig } from "./config";
import { initializeServer } from "./grpc/server";

(async function () {
    // register dependencies into container
    container.register({
        config: asFunction(getAppConfig).classic().singleton(),
        configEventEmitter: asClass(ConfigEventEmitter).classic().singleton(),
        localCache: asClass(LocalCache).classic().singleton(),
        store: asFunction(makeStore).classic().singleton(),
        configService: asClass(ConfigService).classic().singleton()
    })

    // setup config event listener
    container.cradle.configEventEmitter.onConfigUpdated(
        container.cradle.localCache.setManyLocalConfigs
    );

    // server setup
    initializeServer(container.cradle.config.port);
})();