export type TPrismaOperations =
  | 'aggregate'
  | 'count'
  | 'create'
  | 'createMany'
  | 'delete'
  | 'deleteMany'
  | 'findFirst'
  | 'findMany'
  | 'findUnique'
  | 'update'
  | 'updateMany'
  | 'upsert';

export enum EPrismaErrorCodes {
  UNIQUE_VIOLATION = 'P2002',
}

export type TDelegateArgs<T> = {
  [K in keyof T]: T[K] extends (args: infer A) => Promise<unknown> ? A : never;
};

export type TDelegateReturnTypes<T> = {
  [K in keyof T]: T[K] extends (args: infer A) => Promise<infer R> ? R : never;
};
