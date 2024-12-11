import { StoreName } from "./common.types"

export type MysqlStoreConfig = {
    host: string,
    user: string,
    password: string,
    database: string,
    waitForConnections: boolean,
    connectionLimit: number,
    maxIdle: number,
    idleTimeout: number,
    queueLimit: number,
    pollIntervalInSeconds: number
}

export type $AppConfig = {
    port: number,
    storeName: StoreName,
    mysqlStoreConfig?: MysqlStoreConfig
}