import { $AppConfig } from "./types/appConfig.types";
import { StoreName } from "./types/common.types"

export function getAppConfig() {
    const config: $AppConfig = {
        port: +(process.env.PORT as string),
        storeName: process.env.STORE_NAME as StoreName,
    }

    if(config.storeName == StoreName.mysql) {
        config.mysqlStoreConfig = {
            host: process.env.MYSQL_HOST as string,
            port: +(process.env.MYSQL_PORT as string) || undefined,
            user: process.env.MYSQL_USER as string,
            password: process.env.MYSQL_PASSWORD as string,
            database: process.env.MYSQL_DATABASE as string,
            waitForConnections: true,
            connectionLimit: +(process.env.MYSQL_CONNECTION_LIMIT as string) || 100,
            maxIdle: +(process.env.MYSQL_MAX_IDLE as string) || 10,
            idleTimeout: +(process.env.MYSQL_IDLE_TIMEOUT as string) || 6000,
            queueLimit: +(process.env.MYSQL_QUEUE_LIMIT as string) || 6000,
            pollIntervalInSeconds: +(process.env.MYSQL_POLL_INTERVALIN_SECONDS as string)
        }
    }

    // todo: validate config

    return config;
}