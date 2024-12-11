import StoreContract from "../core/StoreContract";
import { MysqlManager } from "../database/mysql.db";
import MysqlStore from "../stores/MysqlStore";
import { $AppConfig, MysqlStoreConfig } from "../types/appConfig.types";
import { Optional, StoreName } from "../types/common.types";

function makeMysqlStore(mysqlConfig: Optional<MysqlStoreConfig>) {
    if(!mysqlConfig) {
        throw new Error("Mysql config is required to setup mysql store")
    }

    const mysqlManager = new MysqlManager({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        waitForConnections: mysqlConfig.waitForConnections,
        connectionLimit: mysqlConfig.connectionLimit,
        maxIdle: mysqlConfig.maxIdle,
        idleTimeout: mysqlConfig.idleTimeout,
        queueLimit: mysqlConfig.queueLimit
    })

    const store = new MysqlStore(mysqlManager, {
        pollIntervalInSeconds: mysqlConfig.pollIntervalInSeconds
    });
    return store;
}

export default function makeStore(config: $AppConfig): StoreContract {
    switch (config.storeName) {
        case StoreName.mysql:
            return makeMysqlStore(config.mysqlStoreConfig);
            break;
    
        default:
            throw new Error("Invalid store")
            break;
    }
}