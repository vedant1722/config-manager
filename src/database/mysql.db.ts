import * as mysql from "mysql2/promise";
import { Primitive } from "../types/common.types";

export class MysqlManager {
    protected pool: mysql.Pool;
    constructor(conn: mysql.PoolOptions) {
        // Create the connection pool. The pool-specific settings are the defaults
        this.pool = mysql.createPool({
            host: conn.host,
            user: conn.user,
            port: conn.port,
            database: conn.database,
            password: conn.password,
            waitForConnections: conn.waitForConnections,
            connectionLimit: conn.connectionLimit,
            maxIdle: conn.maxIdle,
            idleTimeout: conn.idleTimeout,
            queueLimit: conn.queueLimit,
            enableKeepAlive: conn.enableKeepAlive,
            keepAliveInitialDelay: conn.keepAliveInitialDelay,
        });
    }

    async execute<T>({ sql, values = [] }: { sql: string, values?: Primitive[] }) {
        const connection = await this.pool.getConnection();
        try {
            const [results] = await connection.execute({ sql, values });
            return results as T;
        } finally {
            connection.release();
        }
    }
}

/**
 * Migration queries
 * CREATE TABLE `config_store`.`configs` (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `appId` VARCHAR(36) NOT NULL , `env` VARCHAR(255) NOT NULL , `version` VARCHAR(255) NOT NULL , `config` JSON NOT NULL , `updatedAt` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
 */