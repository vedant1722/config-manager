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
            user: process.env.MYSQL_USER as string,
            password: process.env.MYSQL_PASSWORD as string,
            database: process.env.MYSQL_DATABASE as string,
            waitForConnections: true,
            connectionLimit: +(process.env.CONNECTION_LIMIT as string) || 100,
            maxIdle: +(process.env.MAX_IDLE as string) || 10,
            idleTimeout: +(process.env.MAX_IDLE as string) || 6000,
            queueLimit: +(process.env.QUEUE_LIMIT as string) || 6000,
            pollIntervalInSeconds: +(process.env.POLL_INTERVALIN_SECONDS as string) || 6000
        }
    }

    return config;
}