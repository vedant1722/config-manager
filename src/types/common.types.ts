export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Primitive = string | number | boolean;

export type NullablePrimitive = Nullable<Primitive>;

export type JsonKeyValue = NullablePrimitive | JsonObject | Array<NullablePrimitive | JsonObject>;

export type JsonObject = {
    [key: string]: JsonKeyValue;
}

export enum StoreName {
    mysql = 'mysql',
    postgres = 'postgres',
}