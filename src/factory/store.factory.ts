import StoreContract from "../core/StoreContract";
import { MysqlManager } from "../database/mysql.db";
import { PostgresManager } from "../database/postgres.db";
import MysqlStore from "../stores/MysqlStore";
import PostgreStore from "../stores/PostgreStore";
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

async function makePostgreStore(pgConfig: $AppConfig["postgresStoreConfig"]) {
    if(!pgConfig) {
        throw new Error("Postgres config is required to setup postgres store")
    }

    const pgManager = new PostgresManager(pgConfig);
    const store = new PostgreStore(pgManager);
    await store.registerConfigUpdatedListner();
    return store;
}

export default async function makeStore(config: $AppConfig): Promise<StoreContract> {
    switch (config.storeName) {
        case StoreName.mysql:
            return makeMysqlStore(config.mysqlStoreConfig);
            break;

        case StoreName.postgres:
            return await makePostgreStore(config.postgresStoreConfig);
            break;
    
        default:
            throw new Error("Invalid store")
            break;
    }
}