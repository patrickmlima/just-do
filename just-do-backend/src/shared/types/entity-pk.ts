import type { ObjectLiteral } from 'typeorm';

export type EntityWithId = { id: number } & ObjectLiteral;
