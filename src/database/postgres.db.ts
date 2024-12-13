import pg from "pg";
import { Primitive } from "../types/common.types";

export class PostgresManager {
    private pool: pg.Pool;

    private config: pg.PoolConfig;

    constructor(config: pg.PoolConfig) {
        this.config = config;

        this.pool = new pg.Pool({
            connectionString: config.connectionString,
            host: config.host,
            user: config.user,
            port: config.port,
            database: config.database,
            password: config.password,
            ssl: config.ssl,
            max: config.max,
            maxLifetimeSeconds: config.maxLifetimeSeconds,
            query_timeout: config.query_timeout,
            application_name: config.application_name,
            connectionTimeoutMillis: config.connectionTimeoutMillis,
            idle_in_transaction_session_timeout: config.idle_in_transaction_session_timeout,
        });
    }

    async execute<T>({ sql, values = [] }: { sql: string, values?: Primitive[] }) {
        const result = await this.pool.query(sql, values);
        return result.rows as T[];
    }

    async getClient() {
        const client = new pg.Client(this.config);
        await client.connect();
        return client;
    }
}