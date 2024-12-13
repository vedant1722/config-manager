import { StoreName } from "./common.types"
import { PoolConfig as PostgresConfig } from "pg";

export type MysqlStoreConfig = {
    host: string,
    port?: number,
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
    mysqlStoreConfig?: MysqlStoreConfig,
    postgresStoreConfig?: PostgresConfig
}