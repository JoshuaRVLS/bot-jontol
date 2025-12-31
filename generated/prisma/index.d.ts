
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Bounty
 * 
 */
export type Bounty = $Result.DefaultSelection<Prisma.$BountyPayload>
/**
 * Model MarketAsset
 * 
 */
export type MarketAsset = $Result.DefaultSelection<Prisma.$MarketAssetPayload>
/**
 * Model Warning
 * 
 */
export type Warning = $Result.DefaultSelection<Prisma.$WarningPayload>
/**
 * Model Giveaway
 * 
 */
export type Giveaway = $Result.DefaultSelection<Prisma.$GiveawayPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bounty`: Exposes CRUD operations for the **Bounty** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bounties
    * const bounties = await prisma.bounty.findMany()
    * ```
    */
  get bounty(): Prisma.BountyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.marketAsset`: Exposes CRUD operations for the **MarketAsset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MarketAssets
    * const marketAssets = await prisma.marketAsset.findMany()
    * ```
    */
  get marketAsset(): Prisma.MarketAssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.warning`: Exposes CRUD operations for the **Warning** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Warnings
    * const warnings = await prisma.warning.findMany()
    * ```
    */
  get warning(): Prisma.WarningDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.giveaway`: Exposes CRUD operations for the **Giveaway** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Giveaways
    * const giveaways = await prisma.giveaway.findMany()
    * ```
    */
  get giveaway(): Prisma.GiveawayDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Bounty: 'Bounty',
    MarketAsset: 'MarketAsset',
    Warning: 'Warning',
    Giveaway: 'Giveaway'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "bounty" | "marketAsset" | "warning" | "giveaway"
      txIsolationLevel: never
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Bounty: {
        payload: Prisma.$BountyPayload<ExtArgs>
        fields: Prisma.BountyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BountyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BountyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>
          }
          findFirst: {
            args: Prisma.BountyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BountyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>
          }
          findMany: {
            args: Prisma.BountyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>[]
          }
          create: {
            args: Prisma.BountyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>
          }
          createMany: {
            args: Prisma.BountyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BountyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>
          }
          update: {
            args: Prisma.BountyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>
          }
          deleteMany: {
            args: Prisma.BountyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BountyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BountyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BountyPayload>
          }
          aggregate: {
            args: Prisma.BountyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBounty>
          }
          groupBy: {
            args: Prisma.BountyGroupByArgs<ExtArgs>
            result: $Utils.Optional<BountyGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.BountyFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.BountyAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.BountyCountArgs<ExtArgs>
            result: $Utils.Optional<BountyCountAggregateOutputType> | number
          }
        }
      }
      MarketAsset: {
        payload: Prisma.$MarketAssetPayload<ExtArgs>
        fields: Prisma.MarketAssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MarketAssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MarketAssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>
          }
          findFirst: {
            args: Prisma.MarketAssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MarketAssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>
          }
          findMany: {
            args: Prisma.MarketAssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>[]
          }
          create: {
            args: Prisma.MarketAssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>
          }
          createMany: {
            args: Prisma.MarketAssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MarketAssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>
          }
          update: {
            args: Prisma.MarketAssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>
          }
          deleteMany: {
            args: Prisma.MarketAssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MarketAssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MarketAssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MarketAssetPayload>
          }
          aggregate: {
            args: Prisma.MarketAssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMarketAsset>
          }
          groupBy: {
            args: Prisma.MarketAssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<MarketAssetGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MarketAssetFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.MarketAssetAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.MarketAssetCountArgs<ExtArgs>
            result: $Utils.Optional<MarketAssetCountAggregateOutputType> | number
          }
        }
      }
      Warning: {
        payload: Prisma.$WarningPayload<ExtArgs>
        fields: Prisma.WarningFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WarningFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WarningFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          findFirst: {
            args: Prisma.WarningFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WarningFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          findMany: {
            args: Prisma.WarningFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>[]
          }
          create: {
            args: Prisma.WarningCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          createMany: {
            args: Prisma.WarningCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.WarningDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          update: {
            args: Prisma.WarningUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          deleteMany: {
            args: Prisma.WarningDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WarningUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WarningUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WarningPayload>
          }
          aggregate: {
            args: Prisma.WarningAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWarning>
          }
          groupBy: {
            args: Prisma.WarningGroupByArgs<ExtArgs>
            result: $Utils.Optional<WarningGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.WarningFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.WarningAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.WarningCountArgs<ExtArgs>
            result: $Utils.Optional<WarningCountAggregateOutputType> | number
          }
        }
      }
      Giveaway: {
        payload: Prisma.$GiveawayPayload<ExtArgs>
        fields: Prisma.GiveawayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GiveawayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GiveawayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>
          }
          findFirst: {
            args: Prisma.GiveawayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GiveawayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>
          }
          findMany: {
            args: Prisma.GiveawayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>[]
          }
          create: {
            args: Prisma.GiveawayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>
          }
          createMany: {
            args: Prisma.GiveawayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GiveawayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>
          }
          update: {
            args: Prisma.GiveawayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>
          }
          deleteMany: {
            args: Prisma.GiveawayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GiveawayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GiveawayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiveawayPayload>
          }
          aggregate: {
            args: Prisma.GiveawayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGiveaway>
          }
          groupBy: {
            args: Prisma.GiveawayGroupByArgs<ExtArgs>
            result: $Utils.Optional<GiveawayGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.GiveawayFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.GiveawayAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.GiveawayCountArgs<ExtArgs>
            result: $Utils.Optional<GiveawayCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    bounty?: BountyOmit
    marketAsset?: MarketAssetOmit
    warning?: WarningOmit
    giveaway?: GiveawayOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    warnings: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warnings?: boolean | UserCountOutputTypeCountWarningsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWarningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WarningWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    bank: number | null
    wallet: number | null
    dailyStreak: number | null
    xp: number | null
    level: number | null
  }

  export type UserSumAggregateOutputType = {
    bank: number | null
    wallet: number | null
    dailyStreak: number | null
    xp: number | null
    level: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    bank: number | null
    wallet: number | null
    lastDaily: Date | null
    lastWork: Date | null
    lastRob: Date | null
    lastCrime: Date | null
    dailyStreak: number | null
    xp: number | null
    level: number | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    bank: number | null
    wallet: number | null
    lastDaily: Date | null
    lastWork: Date | null
    lastRob: Date | null
    lastCrime: Date | null
    dailyStreak: number | null
    xp: number | null
    level: number | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    bank: number
    wallet: number
    lastDaily: number
    lastWork: number
    lastRob: number
    lastCrime: number
    inventory: number
    investments: number
    dailyStreak: number
    xp: number
    level: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    bank?: true
    wallet?: true
    dailyStreak?: true
    xp?: true
    level?: true
  }

  export type UserSumAggregateInputType = {
    bank?: true
    wallet?: true
    dailyStreak?: true
    xp?: true
    level?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    bank?: true
    wallet?: true
    lastDaily?: true
    lastWork?: true
    lastRob?: true
    lastCrime?: true
    dailyStreak?: true
    xp?: true
    level?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    bank?: true
    wallet?: true
    lastDaily?: true
    lastWork?: true
    lastRob?: true
    lastCrime?: true
    dailyStreak?: true
    xp?: true
    level?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    bank?: true
    wallet?: true
    lastDaily?: true
    lastWork?: true
    lastRob?: true
    lastCrime?: true
    inventory?: true
    investments?: true
    dailyStreak?: true
    xp?: true
    level?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    bank: number
    wallet: number
    lastDaily: Date | null
    lastWork: Date | null
    lastRob: Date | null
    lastCrime: Date | null
    inventory: JsonValue
    investments: JsonValue
    dailyStreak: number
    xp: number
    level: number
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bank?: boolean
    wallet?: boolean
    lastDaily?: boolean
    lastWork?: boolean
    lastRob?: boolean
    lastCrime?: boolean
    inventory?: boolean
    investments?: boolean
    dailyStreak?: boolean
    xp?: boolean
    level?: boolean
    createdAt?: boolean
    warnings?: boolean | User$warningsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    bank?: boolean
    wallet?: boolean
    lastDaily?: boolean
    lastWork?: boolean
    lastRob?: boolean
    lastCrime?: boolean
    inventory?: boolean
    investments?: boolean
    dailyStreak?: boolean
    xp?: boolean
    level?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bank" | "wallet" | "lastDaily" | "lastWork" | "lastRob" | "lastCrime" | "inventory" | "investments" | "dailyStreak" | "xp" | "level" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    warnings?: boolean | User$warningsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      warnings: Prisma.$WarningPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bank: number
      wallet: number
      lastDaily: Date | null
      lastWork: Date | null
      lastRob: Date | null
      lastCrime: Date | null
      inventory: Prisma.JsonValue
      investments: Prisma.JsonValue
      dailyStreak: number
      xp: number
      level: number
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UserFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UserAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    warnings<T extends User$warningsArgs<ExtArgs> = {}>(args?: Subset<T, User$warningsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly bank: FieldRef<"User", 'Float'>
    readonly wallet: FieldRef<"User", 'Float'>
    readonly lastDaily: FieldRef<"User", 'DateTime'>
    readonly lastWork: FieldRef<"User", 'DateTime'>
    readonly lastRob: FieldRef<"User", 'DateTime'>
    readonly lastCrime: FieldRef<"User", 'DateTime'>
    readonly inventory: FieldRef<"User", 'Json'>
    readonly investments: FieldRef<"User", 'Json'>
    readonly dailyStreak: FieldRef<"User", 'Int'>
    readonly xp: FieldRef<"User", 'Int'>
    readonly level: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User findRaw
   */
  export type UserFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User.warnings
   */
  export type User$warningsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    where?: WarningWhereInput
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    cursor?: WarningWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Bounty
   */

  export type AggregateBounty = {
    _count: BountyCountAggregateOutputType | null
    _avg: BountyAvgAggregateOutputType | null
    _sum: BountySumAggregateOutputType | null
    _min: BountyMinAggregateOutputType | null
    _max: BountyMaxAggregateOutputType | null
  }

  export type BountyAvgAggregateOutputType = {
    reward: number | null
  }

  export type BountySumAggregateOutputType = {
    reward: number | null
  }

  export type BountyMinAggregateOutputType = {
    id: string | null
    targetId: string | null
    reward: number | null
    placedBy: string | null
    createdAt: Date | null
  }

  export type BountyMaxAggregateOutputType = {
    id: string | null
    targetId: string | null
    reward: number | null
    placedBy: string | null
    createdAt: Date | null
  }

  export type BountyCountAggregateOutputType = {
    id: number
    targetId: number
    reward: number
    placedBy: number
    createdAt: number
    _all: number
  }


  export type BountyAvgAggregateInputType = {
    reward?: true
  }

  export type BountySumAggregateInputType = {
    reward?: true
  }

  export type BountyMinAggregateInputType = {
    id?: true
    targetId?: true
    reward?: true
    placedBy?: true
    createdAt?: true
  }

  export type BountyMaxAggregateInputType = {
    id?: true
    targetId?: true
    reward?: true
    placedBy?: true
    createdAt?: true
  }

  export type BountyCountAggregateInputType = {
    id?: true
    targetId?: true
    reward?: true
    placedBy?: true
    createdAt?: true
    _all?: true
  }

  export type BountyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bounty to aggregate.
     */
    where?: BountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bounties to fetch.
     */
    orderBy?: BountyOrderByWithRelationInput | BountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bounties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bounties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bounties
    **/
    _count?: true | BountyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BountyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BountySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BountyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BountyMaxAggregateInputType
  }

  export type GetBountyAggregateType<T extends BountyAggregateArgs> = {
        [P in keyof T & keyof AggregateBounty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBounty[P]>
      : GetScalarType<T[P], AggregateBounty[P]>
  }




  export type BountyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BountyWhereInput
    orderBy?: BountyOrderByWithAggregationInput | BountyOrderByWithAggregationInput[]
    by: BountyScalarFieldEnum[] | BountyScalarFieldEnum
    having?: BountyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BountyCountAggregateInputType | true
    _avg?: BountyAvgAggregateInputType
    _sum?: BountySumAggregateInputType
    _min?: BountyMinAggregateInputType
    _max?: BountyMaxAggregateInputType
  }

  export type BountyGroupByOutputType = {
    id: string
    targetId: string
    reward: number
    placedBy: string
    createdAt: Date
    _count: BountyCountAggregateOutputType | null
    _avg: BountyAvgAggregateOutputType | null
    _sum: BountySumAggregateOutputType | null
    _min: BountyMinAggregateOutputType | null
    _max: BountyMaxAggregateOutputType | null
  }

  type GetBountyGroupByPayload<T extends BountyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BountyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BountyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BountyGroupByOutputType[P]>
            : GetScalarType<T[P], BountyGroupByOutputType[P]>
        }
      >
    >


  export type BountySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    reward?: boolean
    placedBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["bounty"]>



  export type BountySelectScalar = {
    id?: boolean
    targetId?: boolean
    reward?: boolean
    placedBy?: boolean
    createdAt?: boolean
  }

  export type BountyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "targetId" | "reward" | "placedBy" | "createdAt", ExtArgs["result"]["bounty"]>

  export type $BountyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bounty"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      targetId: string
      reward: number
      placedBy: string
      createdAt: Date
    }, ExtArgs["result"]["bounty"]>
    composites: {}
  }

  type BountyGetPayload<S extends boolean | null | undefined | BountyDefaultArgs> = $Result.GetResult<Prisma.$BountyPayload, S>

  type BountyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BountyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BountyCountAggregateInputType | true
    }

  export interface BountyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bounty'], meta: { name: 'Bounty' } }
    /**
     * Find zero or one Bounty that matches the filter.
     * @param {BountyFindUniqueArgs} args - Arguments to find a Bounty
     * @example
     * // Get one Bounty
     * const bounty = await prisma.bounty.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BountyFindUniqueArgs>(args: SelectSubset<T, BountyFindUniqueArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bounty that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BountyFindUniqueOrThrowArgs} args - Arguments to find a Bounty
     * @example
     * // Get one Bounty
     * const bounty = await prisma.bounty.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BountyFindUniqueOrThrowArgs>(args: SelectSubset<T, BountyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bounty that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyFindFirstArgs} args - Arguments to find a Bounty
     * @example
     * // Get one Bounty
     * const bounty = await prisma.bounty.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BountyFindFirstArgs>(args?: SelectSubset<T, BountyFindFirstArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bounty that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyFindFirstOrThrowArgs} args - Arguments to find a Bounty
     * @example
     * // Get one Bounty
     * const bounty = await prisma.bounty.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BountyFindFirstOrThrowArgs>(args?: SelectSubset<T, BountyFindFirstOrThrowArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bounties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bounties
     * const bounties = await prisma.bounty.findMany()
     * 
     * // Get first 10 Bounties
     * const bounties = await prisma.bounty.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bountyWithIdOnly = await prisma.bounty.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BountyFindManyArgs>(args?: SelectSubset<T, BountyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bounty.
     * @param {BountyCreateArgs} args - Arguments to create a Bounty.
     * @example
     * // Create one Bounty
     * const Bounty = await prisma.bounty.create({
     *   data: {
     *     // ... data to create a Bounty
     *   }
     * })
     * 
     */
    create<T extends BountyCreateArgs>(args: SelectSubset<T, BountyCreateArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bounties.
     * @param {BountyCreateManyArgs} args - Arguments to create many Bounties.
     * @example
     * // Create many Bounties
     * const bounty = await prisma.bounty.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BountyCreateManyArgs>(args?: SelectSubset<T, BountyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Bounty.
     * @param {BountyDeleteArgs} args - Arguments to delete one Bounty.
     * @example
     * // Delete one Bounty
     * const Bounty = await prisma.bounty.delete({
     *   where: {
     *     // ... filter to delete one Bounty
     *   }
     * })
     * 
     */
    delete<T extends BountyDeleteArgs>(args: SelectSubset<T, BountyDeleteArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bounty.
     * @param {BountyUpdateArgs} args - Arguments to update one Bounty.
     * @example
     * // Update one Bounty
     * const bounty = await prisma.bounty.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BountyUpdateArgs>(args: SelectSubset<T, BountyUpdateArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bounties.
     * @param {BountyDeleteManyArgs} args - Arguments to filter Bounties to delete.
     * @example
     * // Delete a few Bounties
     * const { count } = await prisma.bounty.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BountyDeleteManyArgs>(args?: SelectSubset<T, BountyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bounties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bounties
     * const bounty = await prisma.bounty.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BountyUpdateManyArgs>(args: SelectSubset<T, BountyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bounty.
     * @param {BountyUpsertArgs} args - Arguments to update or create a Bounty.
     * @example
     * // Update or create a Bounty
     * const bounty = await prisma.bounty.upsert({
     *   create: {
     *     // ... data to create a Bounty
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bounty we want to update
     *   }
     * })
     */
    upsert<T extends BountyUpsertArgs>(args: SelectSubset<T, BountyUpsertArgs<ExtArgs>>): Prisma__BountyClient<$Result.GetResult<Prisma.$BountyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bounties that matches the filter.
     * @param {BountyFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const bounty = await prisma.bounty.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: BountyFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Bounty.
     * @param {BountyAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const bounty = await prisma.bounty.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: BountyAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Bounties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyCountArgs} args - Arguments to filter Bounties to count.
     * @example
     * // Count the number of Bounties
     * const count = await prisma.bounty.count({
     *   where: {
     *     // ... the filter for the Bounties we want to count
     *   }
     * })
    **/
    count<T extends BountyCountArgs>(
      args?: Subset<T, BountyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BountyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bounty.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BountyAggregateArgs>(args: Subset<T, BountyAggregateArgs>): Prisma.PrismaPromise<GetBountyAggregateType<T>>

    /**
     * Group by Bounty.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BountyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BountyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BountyGroupByArgs['orderBy'] }
        : { orderBy?: BountyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BountyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBountyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bounty model
   */
  readonly fields: BountyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bounty.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BountyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bounty model
   */
  interface BountyFieldRefs {
    readonly id: FieldRef<"Bounty", 'String'>
    readonly targetId: FieldRef<"Bounty", 'String'>
    readonly reward: FieldRef<"Bounty", 'Float'>
    readonly placedBy: FieldRef<"Bounty", 'String'>
    readonly createdAt: FieldRef<"Bounty", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bounty findUnique
   */
  export type BountyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * Filter, which Bounty to fetch.
     */
    where: BountyWhereUniqueInput
  }

  /**
   * Bounty findUniqueOrThrow
   */
  export type BountyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * Filter, which Bounty to fetch.
     */
    where: BountyWhereUniqueInput
  }

  /**
   * Bounty findFirst
   */
  export type BountyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * Filter, which Bounty to fetch.
     */
    where?: BountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bounties to fetch.
     */
    orderBy?: BountyOrderByWithRelationInput | BountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bounties.
     */
    cursor?: BountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bounties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bounties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bounties.
     */
    distinct?: BountyScalarFieldEnum | BountyScalarFieldEnum[]
  }

  /**
   * Bounty findFirstOrThrow
   */
  export type BountyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * Filter, which Bounty to fetch.
     */
    where?: BountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bounties to fetch.
     */
    orderBy?: BountyOrderByWithRelationInput | BountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bounties.
     */
    cursor?: BountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bounties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bounties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bounties.
     */
    distinct?: BountyScalarFieldEnum | BountyScalarFieldEnum[]
  }

  /**
   * Bounty findMany
   */
  export type BountyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * Filter, which Bounties to fetch.
     */
    where?: BountyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bounties to fetch.
     */
    orderBy?: BountyOrderByWithRelationInput | BountyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bounties.
     */
    cursor?: BountyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bounties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bounties.
     */
    skip?: number
    distinct?: BountyScalarFieldEnum | BountyScalarFieldEnum[]
  }

  /**
   * Bounty create
   */
  export type BountyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * The data needed to create a Bounty.
     */
    data: XOR<BountyCreateInput, BountyUncheckedCreateInput>
  }

  /**
   * Bounty createMany
   */
  export type BountyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bounties.
     */
    data: BountyCreateManyInput | BountyCreateManyInput[]
  }

  /**
   * Bounty update
   */
  export type BountyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * The data needed to update a Bounty.
     */
    data: XOR<BountyUpdateInput, BountyUncheckedUpdateInput>
    /**
     * Choose, which Bounty to update.
     */
    where: BountyWhereUniqueInput
  }

  /**
   * Bounty updateMany
   */
  export type BountyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bounties.
     */
    data: XOR<BountyUpdateManyMutationInput, BountyUncheckedUpdateManyInput>
    /**
     * Filter which Bounties to update
     */
    where?: BountyWhereInput
    /**
     * Limit how many Bounties to update.
     */
    limit?: number
  }

  /**
   * Bounty upsert
   */
  export type BountyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * The filter to search for the Bounty to update in case it exists.
     */
    where: BountyWhereUniqueInput
    /**
     * In case the Bounty found by the `where` argument doesn't exist, create a new Bounty with this data.
     */
    create: XOR<BountyCreateInput, BountyUncheckedCreateInput>
    /**
     * In case the Bounty was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BountyUpdateInput, BountyUncheckedUpdateInput>
  }

  /**
   * Bounty delete
   */
  export type BountyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
    /**
     * Filter which Bounty to delete.
     */
    where: BountyWhereUniqueInput
  }

  /**
   * Bounty deleteMany
   */
  export type BountyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bounties to delete
     */
    where?: BountyWhereInput
    /**
     * Limit how many Bounties to delete.
     */
    limit?: number
  }

  /**
   * Bounty findRaw
   */
  export type BountyFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Bounty aggregateRaw
   */
  export type BountyAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Bounty without action
   */
  export type BountyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bounty
     */
    select?: BountySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bounty
     */
    omit?: BountyOmit<ExtArgs> | null
  }


  /**
   * Model MarketAsset
   */

  export type AggregateMarketAsset = {
    _count: MarketAssetCountAggregateOutputType | null
    _avg: MarketAssetAvgAggregateOutputType | null
    _sum: MarketAssetSumAggregateOutputType | null
    _min: MarketAssetMinAggregateOutputType | null
    _max: MarketAssetMaxAggregateOutputType | null
  }

  export type MarketAssetAvgAggregateOutputType = {
    price: number | null
    lastPrice: number | null
  }

  export type MarketAssetSumAggregateOutputType = {
    price: number | null
    lastPrice: number | null
  }

  export type MarketAssetMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    price: number | null
    lastPrice: number | null
    updatedAt: Date | null
  }

  export type MarketAssetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    price: number | null
    lastPrice: number | null
    updatedAt: Date | null
  }

  export type MarketAssetCountAggregateOutputType = {
    id: number
    name: number
    type: number
    price: number
    lastPrice: number
    updatedAt: number
    _all: number
  }


  export type MarketAssetAvgAggregateInputType = {
    price?: true
    lastPrice?: true
  }

  export type MarketAssetSumAggregateInputType = {
    price?: true
    lastPrice?: true
  }

  export type MarketAssetMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    price?: true
    lastPrice?: true
    updatedAt?: true
  }

  export type MarketAssetMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    price?: true
    lastPrice?: true
    updatedAt?: true
  }

  export type MarketAssetCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    price?: true
    lastPrice?: true
    updatedAt?: true
    _all?: true
  }

  export type MarketAssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketAsset to aggregate.
     */
    where?: MarketAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketAssets to fetch.
     */
    orderBy?: MarketAssetOrderByWithRelationInput | MarketAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MarketAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MarketAssets
    **/
    _count?: true | MarketAssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MarketAssetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MarketAssetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MarketAssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MarketAssetMaxAggregateInputType
  }

  export type GetMarketAssetAggregateType<T extends MarketAssetAggregateArgs> = {
        [P in keyof T & keyof AggregateMarketAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMarketAsset[P]>
      : GetScalarType<T[P], AggregateMarketAsset[P]>
  }




  export type MarketAssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MarketAssetWhereInput
    orderBy?: MarketAssetOrderByWithAggregationInput | MarketAssetOrderByWithAggregationInput[]
    by: MarketAssetScalarFieldEnum[] | MarketAssetScalarFieldEnum
    having?: MarketAssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MarketAssetCountAggregateInputType | true
    _avg?: MarketAssetAvgAggregateInputType
    _sum?: MarketAssetSumAggregateInputType
    _min?: MarketAssetMinAggregateInputType
    _max?: MarketAssetMaxAggregateInputType
  }

  export type MarketAssetGroupByOutputType = {
    id: string
    name: string
    type: string
    price: number
    lastPrice: number
    updatedAt: Date
    _count: MarketAssetCountAggregateOutputType | null
    _avg: MarketAssetAvgAggregateOutputType | null
    _sum: MarketAssetSumAggregateOutputType | null
    _min: MarketAssetMinAggregateOutputType | null
    _max: MarketAssetMaxAggregateOutputType | null
  }

  type GetMarketAssetGroupByPayload<T extends MarketAssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MarketAssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MarketAssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MarketAssetGroupByOutputType[P]>
            : GetScalarType<T[P], MarketAssetGroupByOutputType[P]>
        }
      >
    >


  export type MarketAssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    price?: boolean
    lastPrice?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["marketAsset"]>



  export type MarketAssetSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    price?: boolean
    lastPrice?: boolean
    updatedAt?: boolean
  }

  export type MarketAssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "price" | "lastPrice" | "updatedAt", ExtArgs["result"]["marketAsset"]>

  export type $MarketAssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MarketAsset"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      price: number
      lastPrice: number
      updatedAt: Date
    }, ExtArgs["result"]["marketAsset"]>
    composites: {}
  }

  type MarketAssetGetPayload<S extends boolean | null | undefined | MarketAssetDefaultArgs> = $Result.GetResult<Prisma.$MarketAssetPayload, S>

  type MarketAssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MarketAssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MarketAssetCountAggregateInputType | true
    }

  export interface MarketAssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MarketAsset'], meta: { name: 'MarketAsset' } }
    /**
     * Find zero or one MarketAsset that matches the filter.
     * @param {MarketAssetFindUniqueArgs} args - Arguments to find a MarketAsset
     * @example
     * // Get one MarketAsset
     * const marketAsset = await prisma.marketAsset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MarketAssetFindUniqueArgs>(args: SelectSubset<T, MarketAssetFindUniqueArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MarketAsset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MarketAssetFindUniqueOrThrowArgs} args - Arguments to find a MarketAsset
     * @example
     * // Get one MarketAsset
     * const marketAsset = await prisma.marketAsset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MarketAssetFindUniqueOrThrowArgs>(args: SelectSubset<T, MarketAssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MarketAsset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetFindFirstArgs} args - Arguments to find a MarketAsset
     * @example
     * // Get one MarketAsset
     * const marketAsset = await prisma.marketAsset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MarketAssetFindFirstArgs>(args?: SelectSubset<T, MarketAssetFindFirstArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MarketAsset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetFindFirstOrThrowArgs} args - Arguments to find a MarketAsset
     * @example
     * // Get one MarketAsset
     * const marketAsset = await prisma.marketAsset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MarketAssetFindFirstOrThrowArgs>(args?: SelectSubset<T, MarketAssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MarketAssets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MarketAssets
     * const marketAssets = await prisma.marketAsset.findMany()
     * 
     * // Get first 10 MarketAssets
     * const marketAssets = await prisma.marketAsset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const marketAssetWithIdOnly = await prisma.marketAsset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MarketAssetFindManyArgs>(args?: SelectSubset<T, MarketAssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MarketAsset.
     * @param {MarketAssetCreateArgs} args - Arguments to create a MarketAsset.
     * @example
     * // Create one MarketAsset
     * const MarketAsset = await prisma.marketAsset.create({
     *   data: {
     *     // ... data to create a MarketAsset
     *   }
     * })
     * 
     */
    create<T extends MarketAssetCreateArgs>(args: SelectSubset<T, MarketAssetCreateArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MarketAssets.
     * @param {MarketAssetCreateManyArgs} args - Arguments to create many MarketAssets.
     * @example
     * // Create many MarketAssets
     * const marketAsset = await prisma.marketAsset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MarketAssetCreateManyArgs>(args?: SelectSubset<T, MarketAssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MarketAsset.
     * @param {MarketAssetDeleteArgs} args - Arguments to delete one MarketAsset.
     * @example
     * // Delete one MarketAsset
     * const MarketAsset = await prisma.marketAsset.delete({
     *   where: {
     *     // ... filter to delete one MarketAsset
     *   }
     * })
     * 
     */
    delete<T extends MarketAssetDeleteArgs>(args: SelectSubset<T, MarketAssetDeleteArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MarketAsset.
     * @param {MarketAssetUpdateArgs} args - Arguments to update one MarketAsset.
     * @example
     * // Update one MarketAsset
     * const marketAsset = await prisma.marketAsset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MarketAssetUpdateArgs>(args: SelectSubset<T, MarketAssetUpdateArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MarketAssets.
     * @param {MarketAssetDeleteManyArgs} args - Arguments to filter MarketAssets to delete.
     * @example
     * // Delete a few MarketAssets
     * const { count } = await prisma.marketAsset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MarketAssetDeleteManyArgs>(args?: SelectSubset<T, MarketAssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MarketAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MarketAssets
     * const marketAsset = await prisma.marketAsset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MarketAssetUpdateManyArgs>(args: SelectSubset<T, MarketAssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MarketAsset.
     * @param {MarketAssetUpsertArgs} args - Arguments to update or create a MarketAsset.
     * @example
     * // Update or create a MarketAsset
     * const marketAsset = await prisma.marketAsset.upsert({
     *   create: {
     *     // ... data to create a MarketAsset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MarketAsset we want to update
     *   }
     * })
     */
    upsert<T extends MarketAssetUpsertArgs>(args: SelectSubset<T, MarketAssetUpsertArgs<ExtArgs>>): Prisma__MarketAssetClient<$Result.GetResult<Prisma.$MarketAssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MarketAssets that matches the filter.
     * @param {MarketAssetFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const marketAsset = await prisma.marketAsset.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: MarketAssetFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a MarketAsset.
     * @param {MarketAssetAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const marketAsset = await prisma.marketAsset.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: MarketAssetAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of MarketAssets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetCountArgs} args - Arguments to filter MarketAssets to count.
     * @example
     * // Count the number of MarketAssets
     * const count = await prisma.marketAsset.count({
     *   where: {
     *     // ... the filter for the MarketAssets we want to count
     *   }
     * })
    **/
    count<T extends MarketAssetCountArgs>(
      args?: Subset<T, MarketAssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MarketAssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MarketAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MarketAssetAggregateArgs>(args: Subset<T, MarketAssetAggregateArgs>): Prisma.PrismaPromise<GetMarketAssetAggregateType<T>>

    /**
     * Group by MarketAsset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MarketAssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MarketAssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MarketAssetGroupByArgs['orderBy'] }
        : { orderBy?: MarketAssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MarketAssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MarketAsset model
   */
  readonly fields: MarketAssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MarketAsset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MarketAssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MarketAsset model
   */
  interface MarketAssetFieldRefs {
    readonly id: FieldRef<"MarketAsset", 'String'>
    readonly name: FieldRef<"MarketAsset", 'String'>
    readonly type: FieldRef<"MarketAsset", 'String'>
    readonly price: FieldRef<"MarketAsset", 'Float'>
    readonly lastPrice: FieldRef<"MarketAsset", 'Float'>
    readonly updatedAt: FieldRef<"MarketAsset", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MarketAsset findUnique
   */
  export type MarketAssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * Filter, which MarketAsset to fetch.
     */
    where: MarketAssetWhereUniqueInput
  }

  /**
   * MarketAsset findUniqueOrThrow
   */
  export type MarketAssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * Filter, which MarketAsset to fetch.
     */
    where: MarketAssetWhereUniqueInput
  }

  /**
   * MarketAsset findFirst
   */
  export type MarketAssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * Filter, which MarketAsset to fetch.
     */
    where?: MarketAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketAssets to fetch.
     */
    orderBy?: MarketAssetOrderByWithRelationInput | MarketAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketAssets.
     */
    cursor?: MarketAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketAssets.
     */
    distinct?: MarketAssetScalarFieldEnum | MarketAssetScalarFieldEnum[]
  }

  /**
   * MarketAsset findFirstOrThrow
   */
  export type MarketAssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * Filter, which MarketAsset to fetch.
     */
    where?: MarketAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketAssets to fetch.
     */
    orderBy?: MarketAssetOrderByWithRelationInput | MarketAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MarketAssets.
     */
    cursor?: MarketAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketAssets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MarketAssets.
     */
    distinct?: MarketAssetScalarFieldEnum | MarketAssetScalarFieldEnum[]
  }

  /**
   * MarketAsset findMany
   */
  export type MarketAssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * Filter, which MarketAssets to fetch.
     */
    where?: MarketAssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MarketAssets to fetch.
     */
    orderBy?: MarketAssetOrderByWithRelationInput | MarketAssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MarketAssets.
     */
    cursor?: MarketAssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MarketAssets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MarketAssets.
     */
    skip?: number
    distinct?: MarketAssetScalarFieldEnum | MarketAssetScalarFieldEnum[]
  }

  /**
   * MarketAsset create
   */
  export type MarketAssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * The data needed to create a MarketAsset.
     */
    data: XOR<MarketAssetCreateInput, MarketAssetUncheckedCreateInput>
  }

  /**
   * MarketAsset createMany
   */
  export type MarketAssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MarketAssets.
     */
    data: MarketAssetCreateManyInput | MarketAssetCreateManyInput[]
  }

  /**
   * MarketAsset update
   */
  export type MarketAssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * The data needed to update a MarketAsset.
     */
    data: XOR<MarketAssetUpdateInput, MarketAssetUncheckedUpdateInput>
    /**
     * Choose, which MarketAsset to update.
     */
    where: MarketAssetWhereUniqueInput
  }

  /**
   * MarketAsset updateMany
   */
  export type MarketAssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MarketAssets.
     */
    data: XOR<MarketAssetUpdateManyMutationInput, MarketAssetUncheckedUpdateManyInput>
    /**
     * Filter which MarketAssets to update
     */
    where?: MarketAssetWhereInput
    /**
     * Limit how many MarketAssets to update.
     */
    limit?: number
  }

  /**
   * MarketAsset upsert
   */
  export type MarketAssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * The filter to search for the MarketAsset to update in case it exists.
     */
    where: MarketAssetWhereUniqueInput
    /**
     * In case the MarketAsset found by the `where` argument doesn't exist, create a new MarketAsset with this data.
     */
    create: XOR<MarketAssetCreateInput, MarketAssetUncheckedCreateInput>
    /**
     * In case the MarketAsset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MarketAssetUpdateInput, MarketAssetUncheckedUpdateInput>
  }

  /**
   * MarketAsset delete
   */
  export type MarketAssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
    /**
     * Filter which MarketAsset to delete.
     */
    where: MarketAssetWhereUniqueInput
  }

  /**
   * MarketAsset deleteMany
   */
  export type MarketAssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MarketAssets to delete
     */
    where?: MarketAssetWhereInput
    /**
     * Limit how many MarketAssets to delete.
     */
    limit?: number
  }

  /**
   * MarketAsset findRaw
   */
  export type MarketAssetFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * MarketAsset aggregateRaw
   */
  export type MarketAssetAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * MarketAsset without action
   */
  export type MarketAssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MarketAsset
     */
    select?: MarketAssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MarketAsset
     */
    omit?: MarketAssetOmit<ExtArgs> | null
  }


  /**
   * Model Warning
   */

  export type AggregateWarning = {
    _count: WarningCountAggregateOutputType | null
    _min: WarningMinAggregateOutputType | null
    _max: WarningMaxAggregateOutputType | null
  }

  export type WarningMinAggregateOutputType = {
    id: string | null
    userId: string | null
    moderatorId: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type WarningMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    moderatorId: string | null
    reason: string | null
    createdAt: Date | null
  }

  export type WarningCountAggregateOutputType = {
    id: number
    userId: number
    moderatorId: number
    reason: number
    createdAt: number
    _all: number
  }


  export type WarningMinAggregateInputType = {
    id?: true
    userId?: true
    moderatorId?: true
    reason?: true
    createdAt?: true
  }

  export type WarningMaxAggregateInputType = {
    id?: true
    userId?: true
    moderatorId?: true
    reason?: true
    createdAt?: true
  }

  export type WarningCountAggregateInputType = {
    id?: true
    userId?: true
    moderatorId?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type WarningAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warning to aggregate.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Warnings
    **/
    _count?: true | WarningCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WarningMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WarningMaxAggregateInputType
  }

  export type GetWarningAggregateType<T extends WarningAggregateArgs> = {
        [P in keyof T & keyof AggregateWarning]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWarning[P]>
      : GetScalarType<T[P], AggregateWarning[P]>
  }




  export type WarningGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WarningWhereInput
    orderBy?: WarningOrderByWithAggregationInput | WarningOrderByWithAggregationInput[]
    by: WarningScalarFieldEnum[] | WarningScalarFieldEnum
    having?: WarningScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WarningCountAggregateInputType | true
    _min?: WarningMinAggregateInputType
    _max?: WarningMaxAggregateInputType
  }

  export type WarningGroupByOutputType = {
    id: string
    userId: string
    moderatorId: string
    reason: string
    createdAt: Date
    _count: WarningCountAggregateOutputType | null
    _min: WarningMinAggregateOutputType | null
    _max: WarningMaxAggregateOutputType | null
  }

  type GetWarningGroupByPayload<T extends WarningGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WarningGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WarningGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WarningGroupByOutputType[P]>
            : GetScalarType<T[P], WarningGroupByOutputType[P]>
        }
      >
    >


  export type WarningSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    moderatorId?: boolean
    reason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["warning"]>



  export type WarningSelectScalar = {
    id?: boolean
    userId?: boolean
    moderatorId?: boolean
    reason?: boolean
    createdAt?: boolean
  }

  export type WarningOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "moderatorId" | "reason" | "createdAt", ExtArgs["result"]["warning"]>
  export type WarningInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WarningPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Warning"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      moderatorId: string
      reason: string
      createdAt: Date
    }, ExtArgs["result"]["warning"]>
    composites: {}
  }

  type WarningGetPayload<S extends boolean | null | undefined | WarningDefaultArgs> = $Result.GetResult<Prisma.$WarningPayload, S>

  type WarningCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WarningFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WarningCountAggregateInputType | true
    }

  export interface WarningDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Warning'], meta: { name: 'Warning' } }
    /**
     * Find zero or one Warning that matches the filter.
     * @param {WarningFindUniqueArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WarningFindUniqueArgs>(args: SelectSubset<T, WarningFindUniqueArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Warning that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WarningFindUniqueOrThrowArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WarningFindUniqueOrThrowArgs>(args: SelectSubset<T, WarningFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Warning that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningFindFirstArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WarningFindFirstArgs>(args?: SelectSubset<T, WarningFindFirstArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Warning that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningFindFirstOrThrowArgs} args - Arguments to find a Warning
     * @example
     * // Get one Warning
     * const warning = await prisma.warning.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WarningFindFirstOrThrowArgs>(args?: SelectSubset<T, WarningFindFirstOrThrowArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Warnings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Warnings
     * const warnings = await prisma.warning.findMany()
     * 
     * // Get first 10 Warnings
     * const warnings = await prisma.warning.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const warningWithIdOnly = await prisma.warning.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WarningFindManyArgs>(args?: SelectSubset<T, WarningFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Warning.
     * @param {WarningCreateArgs} args - Arguments to create a Warning.
     * @example
     * // Create one Warning
     * const Warning = await prisma.warning.create({
     *   data: {
     *     // ... data to create a Warning
     *   }
     * })
     * 
     */
    create<T extends WarningCreateArgs>(args: SelectSubset<T, WarningCreateArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Warnings.
     * @param {WarningCreateManyArgs} args - Arguments to create many Warnings.
     * @example
     * // Create many Warnings
     * const warning = await prisma.warning.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WarningCreateManyArgs>(args?: SelectSubset<T, WarningCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Warning.
     * @param {WarningDeleteArgs} args - Arguments to delete one Warning.
     * @example
     * // Delete one Warning
     * const Warning = await prisma.warning.delete({
     *   where: {
     *     // ... filter to delete one Warning
     *   }
     * })
     * 
     */
    delete<T extends WarningDeleteArgs>(args: SelectSubset<T, WarningDeleteArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Warning.
     * @param {WarningUpdateArgs} args - Arguments to update one Warning.
     * @example
     * // Update one Warning
     * const warning = await prisma.warning.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WarningUpdateArgs>(args: SelectSubset<T, WarningUpdateArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Warnings.
     * @param {WarningDeleteManyArgs} args - Arguments to filter Warnings to delete.
     * @example
     * // Delete a few Warnings
     * const { count } = await prisma.warning.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WarningDeleteManyArgs>(args?: SelectSubset<T, WarningDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Warnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Warnings
     * const warning = await prisma.warning.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WarningUpdateManyArgs>(args: SelectSubset<T, WarningUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Warning.
     * @param {WarningUpsertArgs} args - Arguments to update or create a Warning.
     * @example
     * // Update or create a Warning
     * const warning = await prisma.warning.upsert({
     *   create: {
     *     // ... data to create a Warning
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Warning we want to update
     *   }
     * })
     */
    upsert<T extends WarningUpsertArgs>(args: SelectSubset<T, WarningUpsertArgs<ExtArgs>>): Prisma__WarningClient<$Result.GetResult<Prisma.$WarningPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Warnings that matches the filter.
     * @param {WarningFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const warning = await prisma.warning.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: WarningFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Warning.
     * @param {WarningAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const warning = await prisma.warning.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: WarningAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Warnings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningCountArgs} args - Arguments to filter Warnings to count.
     * @example
     * // Count the number of Warnings
     * const count = await prisma.warning.count({
     *   where: {
     *     // ... the filter for the Warnings we want to count
     *   }
     * })
    **/
    count<T extends WarningCountArgs>(
      args?: Subset<T, WarningCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WarningCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Warning.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WarningAggregateArgs>(args: Subset<T, WarningAggregateArgs>): Prisma.PrismaPromise<GetWarningAggregateType<T>>

    /**
     * Group by Warning.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WarningGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WarningGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WarningGroupByArgs['orderBy'] }
        : { orderBy?: WarningGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WarningGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarningGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Warning model
   */
  readonly fields: WarningFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Warning.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WarningClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Warning model
   */
  interface WarningFieldRefs {
    readonly id: FieldRef<"Warning", 'String'>
    readonly userId: FieldRef<"Warning", 'String'>
    readonly moderatorId: FieldRef<"Warning", 'String'>
    readonly reason: FieldRef<"Warning", 'String'>
    readonly createdAt: FieldRef<"Warning", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Warning findUnique
   */
  export type WarningFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning findUniqueOrThrow
   */
  export type WarningFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning findFirst
   */
  export type WarningFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warnings.
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warnings.
     */
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * Warning findFirstOrThrow
   */
  export type WarningFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * Filter, which Warning to fetch.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Warnings.
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Warnings.
     */
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * Warning findMany
   */
  export type WarningFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * Filter, which Warnings to fetch.
     */
    where?: WarningWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Warnings to fetch.
     */
    orderBy?: WarningOrderByWithRelationInput | WarningOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Warnings.
     */
    cursor?: WarningWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Warnings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Warnings.
     */
    skip?: number
    distinct?: WarningScalarFieldEnum | WarningScalarFieldEnum[]
  }

  /**
   * Warning create
   */
  export type WarningCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * The data needed to create a Warning.
     */
    data: XOR<WarningCreateInput, WarningUncheckedCreateInput>
  }

  /**
   * Warning createMany
   */
  export type WarningCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Warnings.
     */
    data: WarningCreateManyInput | WarningCreateManyInput[]
  }

  /**
   * Warning update
   */
  export type WarningUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * The data needed to update a Warning.
     */
    data: XOR<WarningUpdateInput, WarningUncheckedUpdateInput>
    /**
     * Choose, which Warning to update.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning updateMany
   */
  export type WarningUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Warnings.
     */
    data: XOR<WarningUpdateManyMutationInput, WarningUncheckedUpdateManyInput>
    /**
     * Filter which Warnings to update
     */
    where?: WarningWhereInput
    /**
     * Limit how many Warnings to update.
     */
    limit?: number
  }

  /**
   * Warning upsert
   */
  export type WarningUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * The filter to search for the Warning to update in case it exists.
     */
    where: WarningWhereUniqueInput
    /**
     * In case the Warning found by the `where` argument doesn't exist, create a new Warning with this data.
     */
    create: XOR<WarningCreateInput, WarningUncheckedCreateInput>
    /**
     * In case the Warning was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WarningUpdateInput, WarningUncheckedUpdateInput>
  }

  /**
   * Warning delete
   */
  export type WarningDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
    /**
     * Filter which Warning to delete.
     */
    where: WarningWhereUniqueInput
  }

  /**
   * Warning deleteMany
   */
  export type WarningDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Warnings to delete
     */
    where?: WarningWhereInput
    /**
     * Limit how many Warnings to delete.
     */
    limit?: number
  }

  /**
   * Warning findRaw
   */
  export type WarningFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Warning aggregateRaw
   */
  export type WarningAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Warning without action
   */
  export type WarningDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Warning
     */
    select?: WarningSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Warning
     */
    omit?: WarningOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WarningInclude<ExtArgs> | null
  }


  /**
   * Model Giveaway
   */

  export type AggregateGiveaway = {
    _count: GiveawayCountAggregateOutputType | null
    _avg: GiveawayAvgAggregateOutputType | null
    _sum: GiveawaySumAggregateOutputType | null
    _min: GiveawayMinAggregateOutputType | null
    _max: GiveawayMaxAggregateOutputType | null
  }

  export type GiveawayAvgAggregateOutputType = {
    winnersCount: number | null
  }

  export type GiveawaySumAggregateOutputType = {
    winnersCount: number | null
  }

  export type GiveawayMinAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    messageId: string | null
    hostId: string | null
    prize: string | null
    winnersCount: number | null
    endsAt: Date | null
    ended: boolean | null
    createdAt: Date | null
  }

  export type GiveawayMaxAggregateOutputType = {
    id: string | null
    guildId: string | null
    channelId: string | null
    messageId: string | null
    hostId: string | null
    prize: string | null
    winnersCount: number | null
    endsAt: Date | null
    ended: boolean | null
    createdAt: Date | null
  }

  export type GiveawayCountAggregateOutputType = {
    id: number
    guildId: number
    channelId: number
    messageId: number
    hostId: number
    prize: number
    winnersCount: number
    endsAt: number
    ended: number
    participants: number
    winners: number
    createdAt: number
    _all: number
  }


  export type GiveawayAvgAggregateInputType = {
    winnersCount?: true
  }

  export type GiveawaySumAggregateInputType = {
    winnersCount?: true
  }

  export type GiveawayMinAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    messageId?: true
    hostId?: true
    prize?: true
    winnersCount?: true
    endsAt?: true
    ended?: true
    createdAt?: true
  }

  export type GiveawayMaxAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    messageId?: true
    hostId?: true
    prize?: true
    winnersCount?: true
    endsAt?: true
    ended?: true
    createdAt?: true
  }

  export type GiveawayCountAggregateInputType = {
    id?: true
    guildId?: true
    channelId?: true
    messageId?: true
    hostId?: true
    prize?: true
    winnersCount?: true
    endsAt?: true
    ended?: true
    participants?: true
    winners?: true
    createdAt?: true
    _all?: true
  }

  export type GiveawayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Giveaway to aggregate.
     */
    where?: GiveawayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Giveaways to fetch.
     */
    orderBy?: GiveawayOrderByWithRelationInput | GiveawayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GiveawayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Giveaways from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Giveaways.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Giveaways
    **/
    _count?: true | GiveawayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GiveawayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GiveawaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GiveawayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GiveawayMaxAggregateInputType
  }

  export type GetGiveawayAggregateType<T extends GiveawayAggregateArgs> = {
        [P in keyof T & keyof AggregateGiveaway]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGiveaway[P]>
      : GetScalarType<T[P], AggregateGiveaway[P]>
  }




  export type GiveawayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiveawayWhereInput
    orderBy?: GiveawayOrderByWithAggregationInput | GiveawayOrderByWithAggregationInput[]
    by: GiveawayScalarFieldEnum[] | GiveawayScalarFieldEnum
    having?: GiveawayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GiveawayCountAggregateInputType | true
    _avg?: GiveawayAvgAggregateInputType
    _sum?: GiveawaySumAggregateInputType
    _min?: GiveawayMinAggregateInputType
    _max?: GiveawayMaxAggregateInputType
  }

  export type GiveawayGroupByOutputType = {
    id: string
    guildId: string
    channelId: string
    messageId: string
    hostId: string
    prize: string
    winnersCount: number
    endsAt: Date
    ended: boolean
    participants: string[]
    winners: string[]
    createdAt: Date
    _count: GiveawayCountAggregateOutputType | null
    _avg: GiveawayAvgAggregateOutputType | null
    _sum: GiveawaySumAggregateOutputType | null
    _min: GiveawayMinAggregateOutputType | null
    _max: GiveawayMaxAggregateOutputType | null
  }

  type GetGiveawayGroupByPayload<T extends GiveawayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GiveawayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GiveawayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GiveawayGroupByOutputType[P]>
            : GetScalarType<T[P], GiveawayGroupByOutputType[P]>
        }
      >
    >


  export type GiveawaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    messageId?: boolean
    hostId?: boolean
    prize?: boolean
    winnersCount?: boolean
    endsAt?: boolean
    ended?: boolean
    participants?: boolean
    winners?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["giveaway"]>



  export type GiveawaySelectScalar = {
    id?: boolean
    guildId?: boolean
    channelId?: boolean
    messageId?: boolean
    hostId?: boolean
    prize?: boolean
    winnersCount?: boolean
    endsAt?: boolean
    ended?: boolean
    participants?: boolean
    winners?: boolean
    createdAt?: boolean
  }

  export type GiveawayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildId" | "channelId" | "messageId" | "hostId" | "prize" | "winnersCount" | "endsAt" | "ended" | "participants" | "winners" | "createdAt", ExtArgs["result"]["giveaway"]>

  export type $GiveawayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Giveaway"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guildId: string
      channelId: string
      messageId: string
      hostId: string
      prize: string
      winnersCount: number
      endsAt: Date
      ended: boolean
      participants: string[]
      winners: string[]
      createdAt: Date
    }, ExtArgs["result"]["giveaway"]>
    composites: {}
  }

  type GiveawayGetPayload<S extends boolean | null | undefined | GiveawayDefaultArgs> = $Result.GetResult<Prisma.$GiveawayPayload, S>

  type GiveawayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GiveawayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GiveawayCountAggregateInputType | true
    }

  export interface GiveawayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Giveaway'], meta: { name: 'Giveaway' } }
    /**
     * Find zero or one Giveaway that matches the filter.
     * @param {GiveawayFindUniqueArgs} args - Arguments to find a Giveaway
     * @example
     * // Get one Giveaway
     * const giveaway = await prisma.giveaway.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GiveawayFindUniqueArgs>(args: SelectSubset<T, GiveawayFindUniqueArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Giveaway that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GiveawayFindUniqueOrThrowArgs} args - Arguments to find a Giveaway
     * @example
     * // Get one Giveaway
     * const giveaway = await prisma.giveaway.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GiveawayFindUniqueOrThrowArgs>(args: SelectSubset<T, GiveawayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Giveaway that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayFindFirstArgs} args - Arguments to find a Giveaway
     * @example
     * // Get one Giveaway
     * const giveaway = await prisma.giveaway.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GiveawayFindFirstArgs>(args?: SelectSubset<T, GiveawayFindFirstArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Giveaway that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayFindFirstOrThrowArgs} args - Arguments to find a Giveaway
     * @example
     * // Get one Giveaway
     * const giveaway = await prisma.giveaway.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GiveawayFindFirstOrThrowArgs>(args?: SelectSubset<T, GiveawayFindFirstOrThrowArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Giveaways that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Giveaways
     * const giveaways = await prisma.giveaway.findMany()
     * 
     * // Get first 10 Giveaways
     * const giveaways = await prisma.giveaway.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const giveawayWithIdOnly = await prisma.giveaway.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GiveawayFindManyArgs>(args?: SelectSubset<T, GiveawayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Giveaway.
     * @param {GiveawayCreateArgs} args - Arguments to create a Giveaway.
     * @example
     * // Create one Giveaway
     * const Giveaway = await prisma.giveaway.create({
     *   data: {
     *     // ... data to create a Giveaway
     *   }
     * })
     * 
     */
    create<T extends GiveawayCreateArgs>(args: SelectSubset<T, GiveawayCreateArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Giveaways.
     * @param {GiveawayCreateManyArgs} args - Arguments to create many Giveaways.
     * @example
     * // Create many Giveaways
     * const giveaway = await prisma.giveaway.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GiveawayCreateManyArgs>(args?: SelectSubset<T, GiveawayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Giveaway.
     * @param {GiveawayDeleteArgs} args - Arguments to delete one Giveaway.
     * @example
     * // Delete one Giveaway
     * const Giveaway = await prisma.giveaway.delete({
     *   where: {
     *     // ... filter to delete one Giveaway
     *   }
     * })
     * 
     */
    delete<T extends GiveawayDeleteArgs>(args: SelectSubset<T, GiveawayDeleteArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Giveaway.
     * @param {GiveawayUpdateArgs} args - Arguments to update one Giveaway.
     * @example
     * // Update one Giveaway
     * const giveaway = await prisma.giveaway.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GiveawayUpdateArgs>(args: SelectSubset<T, GiveawayUpdateArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Giveaways.
     * @param {GiveawayDeleteManyArgs} args - Arguments to filter Giveaways to delete.
     * @example
     * // Delete a few Giveaways
     * const { count } = await prisma.giveaway.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GiveawayDeleteManyArgs>(args?: SelectSubset<T, GiveawayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Giveaways.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Giveaways
     * const giveaway = await prisma.giveaway.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GiveawayUpdateManyArgs>(args: SelectSubset<T, GiveawayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Giveaway.
     * @param {GiveawayUpsertArgs} args - Arguments to update or create a Giveaway.
     * @example
     * // Update or create a Giveaway
     * const giveaway = await prisma.giveaway.upsert({
     *   create: {
     *     // ... data to create a Giveaway
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Giveaway we want to update
     *   }
     * })
     */
    upsert<T extends GiveawayUpsertArgs>(args: SelectSubset<T, GiveawayUpsertArgs<ExtArgs>>): Prisma__GiveawayClient<$Result.GetResult<Prisma.$GiveawayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Giveaways that matches the filter.
     * @param {GiveawayFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const giveaway = await prisma.giveaway.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: GiveawayFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Giveaway.
     * @param {GiveawayAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const giveaway = await prisma.giveaway.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: GiveawayAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Giveaways.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayCountArgs} args - Arguments to filter Giveaways to count.
     * @example
     * // Count the number of Giveaways
     * const count = await prisma.giveaway.count({
     *   where: {
     *     // ... the filter for the Giveaways we want to count
     *   }
     * })
    **/
    count<T extends GiveawayCountArgs>(
      args?: Subset<T, GiveawayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GiveawayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Giveaway.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GiveawayAggregateArgs>(args: Subset<T, GiveawayAggregateArgs>): Prisma.PrismaPromise<GetGiveawayAggregateType<T>>

    /**
     * Group by Giveaway.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiveawayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GiveawayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GiveawayGroupByArgs['orderBy'] }
        : { orderBy?: GiveawayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GiveawayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGiveawayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Giveaway model
   */
  readonly fields: GiveawayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Giveaway.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GiveawayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Giveaway model
   */
  interface GiveawayFieldRefs {
    readonly id: FieldRef<"Giveaway", 'String'>
    readonly guildId: FieldRef<"Giveaway", 'String'>
    readonly channelId: FieldRef<"Giveaway", 'String'>
    readonly messageId: FieldRef<"Giveaway", 'String'>
    readonly hostId: FieldRef<"Giveaway", 'String'>
    readonly prize: FieldRef<"Giveaway", 'String'>
    readonly winnersCount: FieldRef<"Giveaway", 'Int'>
    readonly endsAt: FieldRef<"Giveaway", 'DateTime'>
    readonly ended: FieldRef<"Giveaway", 'Boolean'>
    readonly participants: FieldRef<"Giveaway", 'String[]'>
    readonly winners: FieldRef<"Giveaway", 'String[]'>
    readonly createdAt: FieldRef<"Giveaway", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Giveaway findUnique
   */
  export type GiveawayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * Filter, which Giveaway to fetch.
     */
    where: GiveawayWhereUniqueInput
  }

  /**
   * Giveaway findUniqueOrThrow
   */
  export type GiveawayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * Filter, which Giveaway to fetch.
     */
    where: GiveawayWhereUniqueInput
  }

  /**
   * Giveaway findFirst
   */
  export type GiveawayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * Filter, which Giveaway to fetch.
     */
    where?: GiveawayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Giveaways to fetch.
     */
    orderBy?: GiveawayOrderByWithRelationInput | GiveawayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Giveaways.
     */
    cursor?: GiveawayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Giveaways from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Giveaways.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Giveaways.
     */
    distinct?: GiveawayScalarFieldEnum | GiveawayScalarFieldEnum[]
  }

  /**
   * Giveaway findFirstOrThrow
   */
  export type GiveawayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * Filter, which Giveaway to fetch.
     */
    where?: GiveawayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Giveaways to fetch.
     */
    orderBy?: GiveawayOrderByWithRelationInput | GiveawayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Giveaways.
     */
    cursor?: GiveawayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Giveaways from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Giveaways.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Giveaways.
     */
    distinct?: GiveawayScalarFieldEnum | GiveawayScalarFieldEnum[]
  }

  /**
   * Giveaway findMany
   */
  export type GiveawayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * Filter, which Giveaways to fetch.
     */
    where?: GiveawayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Giveaways to fetch.
     */
    orderBy?: GiveawayOrderByWithRelationInput | GiveawayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Giveaways.
     */
    cursor?: GiveawayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Giveaways from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Giveaways.
     */
    skip?: number
    distinct?: GiveawayScalarFieldEnum | GiveawayScalarFieldEnum[]
  }

  /**
   * Giveaway create
   */
  export type GiveawayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * The data needed to create a Giveaway.
     */
    data: XOR<GiveawayCreateInput, GiveawayUncheckedCreateInput>
  }

  /**
   * Giveaway createMany
   */
  export type GiveawayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Giveaways.
     */
    data: GiveawayCreateManyInput | GiveawayCreateManyInput[]
  }

  /**
   * Giveaway update
   */
  export type GiveawayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * The data needed to update a Giveaway.
     */
    data: XOR<GiveawayUpdateInput, GiveawayUncheckedUpdateInput>
    /**
     * Choose, which Giveaway to update.
     */
    where: GiveawayWhereUniqueInput
  }

  /**
   * Giveaway updateMany
   */
  export type GiveawayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Giveaways.
     */
    data: XOR<GiveawayUpdateManyMutationInput, GiveawayUncheckedUpdateManyInput>
    /**
     * Filter which Giveaways to update
     */
    where?: GiveawayWhereInput
    /**
     * Limit how many Giveaways to update.
     */
    limit?: number
  }

  /**
   * Giveaway upsert
   */
  export type GiveawayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * The filter to search for the Giveaway to update in case it exists.
     */
    where: GiveawayWhereUniqueInput
    /**
     * In case the Giveaway found by the `where` argument doesn't exist, create a new Giveaway with this data.
     */
    create: XOR<GiveawayCreateInput, GiveawayUncheckedCreateInput>
    /**
     * In case the Giveaway was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GiveawayUpdateInput, GiveawayUncheckedUpdateInput>
  }

  /**
   * Giveaway delete
   */
  export type GiveawayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
    /**
     * Filter which Giveaway to delete.
     */
    where: GiveawayWhereUniqueInput
  }

  /**
   * Giveaway deleteMany
   */
  export type GiveawayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Giveaways to delete
     */
    where?: GiveawayWhereInput
    /**
     * Limit how many Giveaways to delete.
     */
    limit?: number
  }

  /**
   * Giveaway findRaw
   */
  export type GiveawayFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Giveaway aggregateRaw
   */
  export type GiveawayAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Giveaway without action
   */
  export type GiveawayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Giveaway
     */
    select?: GiveawaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Giveaway
     */
    omit?: GiveawayOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const UserScalarFieldEnum: {
    id: 'id',
    bank: 'bank',
    wallet: 'wallet',
    lastDaily: 'lastDaily',
    lastWork: 'lastWork',
    lastRob: 'lastRob',
    lastCrime: 'lastCrime',
    inventory: 'inventory',
    investments: 'investments',
    dailyStreak: 'dailyStreak',
    xp: 'xp',
    level: 'level',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BountyScalarFieldEnum: {
    id: 'id',
    targetId: 'targetId',
    reward: 'reward',
    placedBy: 'placedBy',
    createdAt: 'createdAt'
  };

  export type BountyScalarFieldEnum = (typeof BountyScalarFieldEnum)[keyof typeof BountyScalarFieldEnum]


  export const MarketAssetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    price: 'price',
    lastPrice: 'lastPrice',
    updatedAt: 'updatedAt'
  };

  export type MarketAssetScalarFieldEnum = (typeof MarketAssetScalarFieldEnum)[keyof typeof MarketAssetScalarFieldEnum]


  export const WarningScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    moderatorId: 'moderatorId',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type WarningScalarFieldEnum = (typeof WarningScalarFieldEnum)[keyof typeof WarningScalarFieldEnum]


  export const GiveawayScalarFieldEnum: {
    id: 'id',
    guildId: 'guildId',
    channelId: 'channelId',
    messageId: 'messageId',
    hostId: 'hostId',
    prize: 'prize',
    winnersCount: 'winnersCount',
    endsAt: 'endsAt',
    ended: 'ended',
    participants: 'participants',
    winners: 'winners',
    createdAt: 'createdAt'
  };

  export type GiveawayScalarFieldEnum = (typeof GiveawayScalarFieldEnum)[keyof typeof GiveawayScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    bank?: FloatFilter<"User"> | number
    wallet?: FloatFilter<"User"> | number
    lastDaily?: DateTimeNullableFilter<"User"> | Date | string | null
    lastWork?: DateTimeNullableFilter<"User"> | Date | string | null
    lastRob?: DateTimeNullableFilter<"User"> | Date | string | null
    lastCrime?: DateTimeNullableFilter<"User"> | Date | string | null
    inventory?: JsonFilter<"User">
    investments?: JsonFilter<"User">
    dailyStreak?: IntFilter<"User"> | number
    xp?: IntFilter<"User"> | number
    level?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    warnings?: WarningListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    bank?: SortOrder
    wallet?: SortOrder
    lastDaily?: SortOrder
    lastWork?: SortOrder
    lastRob?: SortOrder
    lastCrime?: SortOrder
    inventory?: SortOrder
    investments?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    warnings?: WarningOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    bank?: FloatFilter<"User"> | number
    wallet?: FloatFilter<"User"> | number
    lastDaily?: DateTimeNullableFilter<"User"> | Date | string | null
    lastWork?: DateTimeNullableFilter<"User"> | Date | string | null
    lastRob?: DateTimeNullableFilter<"User"> | Date | string | null
    lastCrime?: DateTimeNullableFilter<"User"> | Date | string | null
    inventory?: JsonFilter<"User">
    investments?: JsonFilter<"User">
    dailyStreak?: IntFilter<"User"> | number
    xp?: IntFilter<"User"> | number
    level?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    warnings?: WarningListRelationFilter
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    bank?: SortOrder
    wallet?: SortOrder
    lastDaily?: SortOrder
    lastWork?: SortOrder
    lastRob?: SortOrder
    lastCrime?: SortOrder
    inventory?: SortOrder
    investments?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    bank?: FloatWithAggregatesFilter<"User"> | number
    wallet?: FloatWithAggregatesFilter<"User"> | number
    lastDaily?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastWork?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastRob?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastCrime?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    inventory?: JsonWithAggregatesFilter<"User">
    investments?: JsonWithAggregatesFilter<"User">
    dailyStreak?: IntWithAggregatesFilter<"User"> | number
    xp?: IntWithAggregatesFilter<"User"> | number
    level?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type BountyWhereInput = {
    AND?: BountyWhereInput | BountyWhereInput[]
    OR?: BountyWhereInput[]
    NOT?: BountyWhereInput | BountyWhereInput[]
    id?: StringFilter<"Bounty"> | string
    targetId?: StringFilter<"Bounty"> | string
    reward?: FloatFilter<"Bounty"> | number
    placedBy?: StringFilter<"Bounty"> | string
    createdAt?: DateTimeFilter<"Bounty"> | Date | string
  }

  export type BountyOrderByWithRelationInput = {
    id?: SortOrder
    targetId?: SortOrder
    reward?: SortOrder
    placedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type BountyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    targetId?: string
    AND?: BountyWhereInput | BountyWhereInput[]
    OR?: BountyWhereInput[]
    NOT?: BountyWhereInput | BountyWhereInput[]
    reward?: FloatFilter<"Bounty"> | number
    placedBy?: StringFilter<"Bounty"> | string
    createdAt?: DateTimeFilter<"Bounty"> | Date | string
  }, "id" | "targetId">

  export type BountyOrderByWithAggregationInput = {
    id?: SortOrder
    targetId?: SortOrder
    reward?: SortOrder
    placedBy?: SortOrder
    createdAt?: SortOrder
    _count?: BountyCountOrderByAggregateInput
    _avg?: BountyAvgOrderByAggregateInput
    _max?: BountyMaxOrderByAggregateInput
    _min?: BountyMinOrderByAggregateInput
    _sum?: BountySumOrderByAggregateInput
  }

  export type BountyScalarWhereWithAggregatesInput = {
    AND?: BountyScalarWhereWithAggregatesInput | BountyScalarWhereWithAggregatesInput[]
    OR?: BountyScalarWhereWithAggregatesInput[]
    NOT?: BountyScalarWhereWithAggregatesInput | BountyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bounty"> | string
    targetId?: StringWithAggregatesFilter<"Bounty"> | string
    reward?: FloatWithAggregatesFilter<"Bounty"> | number
    placedBy?: StringWithAggregatesFilter<"Bounty"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Bounty"> | Date | string
  }

  export type MarketAssetWhereInput = {
    AND?: MarketAssetWhereInput | MarketAssetWhereInput[]
    OR?: MarketAssetWhereInput[]
    NOT?: MarketAssetWhereInput | MarketAssetWhereInput[]
    id?: StringFilter<"MarketAsset"> | string
    name?: StringFilter<"MarketAsset"> | string
    type?: StringFilter<"MarketAsset"> | string
    price?: FloatFilter<"MarketAsset"> | number
    lastPrice?: FloatFilter<"MarketAsset"> | number
    updatedAt?: DateTimeFilter<"MarketAsset"> | Date | string
  }

  export type MarketAssetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    price?: SortOrder
    lastPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketAssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MarketAssetWhereInput | MarketAssetWhereInput[]
    OR?: MarketAssetWhereInput[]
    NOT?: MarketAssetWhereInput | MarketAssetWhereInput[]
    name?: StringFilter<"MarketAsset"> | string
    type?: StringFilter<"MarketAsset"> | string
    price?: FloatFilter<"MarketAsset"> | number
    lastPrice?: FloatFilter<"MarketAsset"> | number
    updatedAt?: DateTimeFilter<"MarketAsset"> | Date | string
  }, "id">

  export type MarketAssetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    price?: SortOrder
    lastPrice?: SortOrder
    updatedAt?: SortOrder
    _count?: MarketAssetCountOrderByAggregateInput
    _avg?: MarketAssetAvgOrderByAggregateInput
    _max?: MarketAssetMaxOrderByAggregateInput
    _min?: MarketAssetMinOrderByAggregateInput
    _sum?: MarketAssetSumOrderByAggregateInput
  }

  export type MarketAssetScalarWhereWithAggregatesInput = {
    AND?: MarketAssetScalarWhereWithAggregatesInput | MarketAssetScalarWhereWithAggregatesInput[]
    OR?: MarketAssetScalarWhereWithAggregatesInput[]
    NOT?: MarketAssetScalarWhereWithAggregatesInput | MarketAssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MarketAsset"> | string
    name?: StringWithAggregatesFilter<"MarketAsset"> | string
    type?: StringWithAggregatesFilter<"MarketAsset"> | string
    price?: FloatWithAggregatesFilter<"MarketAsset"> | number
    lastPrice?: FloatWithAggregatesFilter<"MarketAsset"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"MarketAsset"> | Date | string
  }

  export type WarningWhereInput = {
    AND?: WarningWhereInput | WarningWhereInput[]
    OR?: WarningWhereInput[]
    NOT?: WarningWhereInput | WarningWhereInput[]
    id?: StringFilter<"Warning"> | string
    userId?: StringFilter<"Warning"> | string
    moderatorId?: StringFilter<"Warning"> | string
    reason?: StringFilter<"Warning"> | string
    createdAt?: DateTimeFilter<"Warning"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WarningOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type WarningWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WarningWhereInput | WarningWhereInput[]
    OR?: WarningWhereInput[]
    NOT?: WarningWhereInput | WarningWhereInput[]
    userId?: StringFilter<"Warning"> | string
    moderatorId?: StringFilter<"Warning"> | string
    reason?: StringFilter<"Warning"> | string
    createdAt?: DateTimeFilter<"Warning"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type WarningOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    _count?: WarningCountOrderByAggregateInput
    _max?: WarningMaxOrderByAggregateInput
    _min?: WarningMinOrderByAggregateInput
  }

  export type WarningScalarWhereWithAggregatesInput = {
    AND?: WarningScalarWhereWithAggregatesInput | WarningScalarWhereWithAggregatesInput[]
    OR?: WarningScalarWhereWithAggregatesInput[]
    NOT?: WarningScalarWhereWithAggregatesInput | WarningScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Warning"> | string
    userId?: StringWithAggregatesFilter<"Warning"> | string
    moderatorId?: StringWithAggregatesFilter<"Warning"> | string
    reason?: StringWithAggregatesFilter<"Warning"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Warning"> | Date | string
  }

  export type GiveawayWhereInput = {
    AND?: GiveawayWhereInput | GiveawayWhereInput[]
    OR?: GiveawayWhereInput[]
    NOT?: GiveawayWhereInput | GiveawayWhereInput[]
    id?: StringFilter<"Giveaway"> | string
    guildId?: StringFilter<"Giveaway"> | string
    channelId?: StringFilter<"Giveaway"> | string
    messageId?: StringFilter<"Giveaway"> | string
    hostId?: StringFilter<"Giveaway"> | string
    prize?: StringFilter<"Giveaway"> | string
    winnersCount?: IntFilter<"Giveaway"> | number
    endsAt?: DateTimeFilter<"Giveaway"> | Date | string
    ended?: BoolFilter<"Giveaway"> | boolean
    participants?: StringNullableListFilter<"Giveaway">
    winners?: StringNullableListFilter<"Giveaway">
    createdAt?: DateTimeFilter<"Giveaway"> | Date | string
  }

  export type GiveawayOrderByWithRelationInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    messageId?: SortOrder
    hostId?: SortOrder
    prize?: SortOrder
    winnersCount?: SortOrder
    endsAt?: SortOrder
    ended?: SortOrder
    participants?: SortOrder
    winners?: SortOrder
    createdAt?: SortOrder
  }

  export type GiveawayWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    messageId?: string
    AND?: GiveawayWhereInput | GiveawayWhereInput[]
    OR?: GiveawayWhereInput[]
    NOT?: GiveawayWhereInput | GiveawayWhereInput[]
    guildId?: StringFilter<"Giveaway"> | string
    channelId?: StringFilter<"Giveaway"> | string
    hostId?: StringFilter<"Giveaway"> | string
    prize?: StringFilter<"Giveaway"> | string
    winnersCount?: IntFilter<"Giveaway"> | number
    endsAt?: DateTimeFilter<"Giveaway"> | Date | string
    ended?: BoolFilter<"Giveaway"> | boolean
    participants?: StringNullableListFilter<"Giveaway">
    winners?: StringNullableListFilter<"Giveaway">
    createdAt?: DateTimeFilter<"Giveaway"> | Date | string
  }, "id" | "messageId">

  export type GiveawayOrderByWithAggregationInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    messageId?: SortOrder
    hostId?: SortOrder
    prize?: SortOrder
    winnersCount?: SortOrder
    endsAt?: SortOrder
    ended?: SortOrder
    participants?: SortOrder
    winners?: SortOrder
    createdAt?: SortOrder
    _count?: GiveawayCountOrderByAggregateInput
    _avg?: GiveawayAvgOrderByAggregateInput
    _max?: GiveawayMaxOrderByAggregateInput
    _min?: GiveawayMinOrderByAggregateInput
    _sum?: GiveawaySumOrderByAggregateInput
  }

  export type GiveawayScalarWhereWithAggregatesInput = {
    AND?: GiveawayScalarWhereWithAggregatesInput | GiveawayScalarWhereWithAggregatesInput[]
    OR?: GiveawayScalarWhereWithAggregatesInput[]
    NOT?: GiveawayScalarWhereWithAggregatesInput | GiveawayScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Giveaway"> | string
    guildId?: StringWithAggregatesFilter<"Giveaway"> | string
    channelId?: StringWithAggregatesFilter<"Giveaway"> | string
    messageId?: StringWithAggregatesFilter<"Giveaway"> | string
    hostId?: StringWithAggregatesFilter<"Giveaway"> | string
    prize?: StringWithAggregatesFilter<"Giveaway"> | string
    winnersCount?: IntWithAggregatesFilter<"Giveaway"> | number
    endsAt?: DateTimeWithAggregatesFilter<"Giveaway"> | Date | string
    ended?: BoolWithAggregatesFilter<"Giveaway"> | boolean
    participants?: StringNullableListFilter<"Giveaway">
    winners?: StringNullableListFilter<"Giveaway">
    createdAt?: DateTimeWithAggregatesFilter<"Giveaway"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    bank?: number
    wallet?: number
    lastDaily?: Date | string | null
    lastWork?: Date | string | null
    lastRob?: Date | string | null
    lastCrime?: Date | string | null
    inventory?: InputJsonValue
    investments?: InputJsonValue
    dailyStreak?: number
    xp?: number
    level?: number
    createdAt?: Date | string
    warnings?: WarningCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    bank?: number
    wallet?: number
    lastDaily?: Date | string | null
    lastWork?: Date | string | null
    lastRob?: Date | string | null
    lastCrime?: Date | string | null
    inventory?: InputJsonValue
    investments?: InputJsonValue
    dailyStreak?: number
    xp?: number
    level?: number
    createdAt?: Date | string
    warnings?: WarningUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    bank?: FloatFieldUpdateOperationsInput | number
    wallet?: FloatFieldUpdateOperationsInput | number
    lastDaily?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastWork?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCrime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inventory?: InputJsonValue | InputJsonValue
    investments?: InputJsonValue | InputJsonValue
    dailyStreak?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    warnings?: WarningUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    bank?: FloatFieldUpdateOperationsInput | number
    wallet?: FloatFieldUpdateOperationsInput | number
    lastDaily?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastWork?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCrime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inventory?: InputJsonValue | InputJsonValue
    investments?: InputJsonValue | InputJsonValue
    dailyStreak?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    warnings?: WarningUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    bank?: number
    wallet?: number
    lastDaily?: Date | string | null
    lastWork?: Date | string | null
    lastRob?: Date | string | null
    lastCrime?: Date | string | null
    inventory?: InputJsonValue
    investments?: InputJsonValue
    dailyStreak?: number
    xp?: number
    level?: number
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    bank?: FloatFieldUpdateOperationsInput | number
    wallet?: FloatFieldUpdateOperationsInput | number
    lastDaily?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastWork?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCrime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inventory?: InputJsonValue | InputJsonValue
    investments?: InputJsonValue | InputJsonValue
    dailyStreak?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    bank?: FloatFieldUpdateOperationsInput | number
    wallet?: FloatFieldUpdateOperationsInput | number
    lastDaily?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastWork?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCrime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inventory?: InputJsonValue | InputJsonValue
    investments?: InputJsonValue | InputJsonValue
    dailyStreak?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BountyCreateInput = {
    id?: string
    targetId: string
    reward: number
    placedBy: string
    createdAt?: Date | string
  }

  export type BountyUncheckedCreateInput = {
    id?: string
    targetId: string
    reward: number
    placedBy: string
    createdAt?: Date | string
  }

  export type BountyUpdateInput = {
    targetId?: StringFieldUpdateOperationsInput | string
    reward?: FloatFieldUpdateOperationsInput | number
    placedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BountyUncheckedUpdateInput = {
    targetId?: StringFieldUpdateOperationsInput | string
    reward?: FloatFieldUpdateOperationsInput | number
    placedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BountyCreateManyInput = {
    id?: string
    targetId: string
    reward: number
    placedBy: string
    createdAt?: Date | string
  }

  export type BountyUpdateManyMutationInput = {
    targetId?: StringFieldUpdateOperationsInput | string
    reward?: FloatFieldUpdateOperationsInput | number
    placedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BountyUncheckedUpdateManyInput = {
    targetId?: StringFieldUpdateOperationsInput | string
    reward?: FloatFieldUpdateOperationsInput | number
    placedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketAssetCreateInput = {
    id: string
    name: string
    type: string
    price: number
    lastPrice?: number
    updatedAt?: Date | string
  }

  export type MarketAssetUncheckedCreateInput = {
    id: string
    name: string
    type: string
    price: number
    lastPrice?: number
    updatedAt?: Date | string
  }

  export type MarketAssetUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    lastPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketAssetUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    lastPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketAssetCreateManyInput = {
    id: string
    name: string
    type: string
    price: number
    lastPrice?: number
    updatedAt?: Date | string
  }

  export type MarketAssetUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    lastPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MarketAssetUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    lastPrice?: FloatFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningCreateInput = {
    id?: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutWarningsInput
  }

  export type WarningUncheckedCreateInput = {
    id?: string
    userId: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUpdateInput = {
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWarningsNestedInput
  }

  export type WarningUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningCreateManyInput = {
    id?: string
    userId: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUpdateManyMutationInput = {
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GiveawayCreateInput = {
    id?: string
    guildId: string
    channelId: string
    messageId: string
    hostId: string
    prize: string
    winnersCount: number
    endsAt: Date | string
    ended?: boolean
    participants?: GiveawayCreateparticipantsInput | string[]
    winners?: GiveawayCreatewinnersInput | string[]
    createdAt?: Date | string
  }

  export type GiveawayUncheckedCreateInput = {
    id?: string
    guildId: string
    channelId: string
    messageId: string
    hostId: string
    prize: string
    winnersCount: number
    endsAt: Date | string
    ended?: boolean
    participants?: GiveawayCreateparticipantsInput | string[]
    winners?: GiveawayCreatewinnersInput | string[]
    createdAt?: Date | string
  }

  export type GiveawayUpdateInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    prize?: StringFieldUpdateOperationsInput | string
    winnersCount?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ended?: BoolFieldUpdateOperationsInput | boolean
    participants?: GiveawayUpdateparticipantsInput | string[]
    winners?: GiveawayUpdatewinnersInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GiveawayUncheckedUpdateInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    prize?: StringFieldUpdateOperationsInput | string
    winnersCount?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ended?: BoolFieldUpdateOperationsInput | boolean
    participants?: GiveawayUpdateparticipantsInput | string[]
    winners?: GiveawayUpdatewinnersInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GiveawayCreateManyInput = {
    id?: string
    guildId: string
    channelId: string
    messageId: string
    hostId: string
    prize: string
    winnersCount: number
    endsAt: Date | string
    ended?: boolean
    participants?: GiveawayCreateparticipantsInput | string[]
    winners?: GiveawayCreatewinnersInput | string[]
    createdAt?: Date | string
  }

  export type GiveawayUpdateManyMutationInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    prize?: StringFieldUpdateOperationsInput | string
    winnersCount?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ended?: BoolFieldUpdateOperationsInput | boolean
    participants?: GiveawayUpdateparticipantsInput | string[]
    winners?: GiveawayUpdatewinnersInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GiveawayUncheckedUpdateManyInput = {
    guildId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    messageId?: StringFieldUpdateOperationsInput | string
    hostId?: StringFieldUpdateOperationsInput | string
    prize?: StringFieldUpdateOperationsInput | string
    winnersCount?: IntFieldUpdateOperationsInput | number
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ended?: BoolFieldUpdateOperationsInput | boolean
    participants?: GiveawayUpdateparticipantsInput | string[]
    winners?: GiveawayUpdatewinnersInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type WarningListRelationFilter = {
    every?: WarningWhereInput
    some?: WarningWhereInput
    none?: WarningWhereInput
  }

  export type WarningOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    bank?: SortOrder
    wallet?: SortOrder
    lastDaily?: SortOrder
    lastWork?: SortOrder
    lastRob?: SortOrder
    lastCrime?: SortOrder
    inventory?: SortOrder
    investments?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    bank?: SortOrder
    wallet?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    bank?: SortOrder
    wallet?: SortOrder
    lastDaily?: SortOrder
    lastWork?: SortOrder
    lastRob?: SortOrder
    lastCrime?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    bank?: SortOrder
    wallet?: SortOrder
    lastDaily?: SortOrder
    lastWork?: SortOrder
    lastRob?: SortOrder
    lastCrime?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    bank?: SortOrder
    wallet?: SortOrder
    dailyStreak?: SortOrder
    xp?: SortOrder
    level?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BountyCountOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    reward?: SortOrder
    placedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type BountyAvgOrderByAggregateInput = {
    reward?: SortOrder
  }

  export type BountyMaxOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    reward?: SortOrder
    placedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type BountyMinOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    reward?: SortOrder
    placedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type BountySumOrderByAggregateInput = {
    reward?: SortOrder
  }

  export type MarketAssetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    price?: SortOrder
    lastPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketAssetAvgOrderByAggregateInput = {
    price?: SortOrder
    lastPrice?: SortOrder
  }

  export type MarketAssetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    price?: SortOrder
    lastPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketAssetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    price?: SortOrder
    lastPrice?: SortOrder
    updatedAt?: SortOrder
  }

  export type MarketAssetSumOrderByAggregateInput = {
    price?: SortOrder
    lastPrice?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type WarningCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type WarningMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type WarningMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    moderatorId?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type GiveawayCountOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    messageId?: SortOrder
    hostId?: SortOrder
    prize?: SortOrder
    winnersCount?: SortOrder
    endsAt?: SortOrder
    ended?: SortOrder
    participants?: SortOrder
    winners?: SortOrder
    createdAt?: SortOrder
  }

  export type GiveawayAvgOrderByAggregateInput = {
    winnersCount?: SortOrder
  }

  export type GiveawayMaxOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    messageId?: SortOrder
    hostId?: SortOrder
    prize?: SortOrder
    winnersCount?: SortOrder
    endsAt?: SortOrder
    ended?: SortOrder
    createdAt?: SortOrder
  }

  export type GiveawayMinOrderByAggregateInput = {
    id?: SortOrder
    guildId?: SortOrder
    channelId?: SortOrder
    messageId?: SortOrder
    hostId?: SortOrder
    prize?: SortOrder
    winnersCount?: SortOrder
    endsAt?: SortOrder
    ended?: SortOrder
    createdAt?: SortOrder
  }

  export type GiveawaySumOrderByAggregateInput = {
    winnersCount?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type WarningCreateNestedManyWithoutUserInput = {
    create?: XOR<WarningCreateWithoutUserInput, WarningUncheckedCreateWithoutUserInput> | WarningCreateWithoutUserInput[] | WarningUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WarningCreateOrConnectWithoutUserInput | WarningCreateOrConnectWithoutUserInput[]
    createMany?: WarningCreateManyUserInputEnvelope
    connect?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
  }

  export type WarningUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WarningCreateWithoutUserInput, WarningUncheckedCreateWithoutUserInput> | WarningCreateWithoutUserInput[] | WarningUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WarningCreateOrConnectWithoutUserInput | WarningCreateOrConnectWithoutUserInput[]
    createMany?: WarningCreateManyUserInputEnvelope
    connect?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WarningUpdateManyWithoutUserNestedInput = {
    create?: XOR<WarningCreateWithoutUserInput, WarningUncheckedCreateWithoutUserInput> | WarningCreateWithoutUserInput[] | WarningUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WarningCreateOrConnectWithoutUserInput | WarningCreateOrConnectWithoutUserInput[]
    upsert?: WarningUpsertWithWhereUniqueWithoutUserInput | WarningUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WarningCreateManyUserInputEnvelope
    set?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    disconnect?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    delete?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    connect?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    update?: WarningUpdateWithWhereUniqueWithoutUserInput | WarningUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WarningUpdateManyWithWhereWithoutUserInput | WarningUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WarningScalarWhereInput | WarningScalarWhereInput[]
  }

  export type WarningUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WarningCreateWithoutUserInput, WarningUncheckedCreateWithoutUserInput> | WarningCreateWithoutUserInput[] | WarningUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WarningCreateOrConnectWithoutUserInput | WarningCreateOrConnectWithoutUserInput[]
    upsert?: WarningUpsertWithWhereUniqueWithoutUserInput | WarningUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WarningCreateManyUserInputEnvelope
    set?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    disconnect?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    delete?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    connect?: WarningWhereUniqueInput | WarningWhereUniqueInput[]
    update?: WarningUpdateWithWhereUniqueWithoutUserInput | WarningUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WarningUpdateManyWithWhereWithoutUserInput | WarningUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WarningScalarWhereInput | WarningScalarWhereInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type UserCreateNestedOneWithoutWarningsInput = {
    create?: XOR<UserCreateWithoutWarningsInput, UserUncheckedCreateWithoutWarningsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWarningsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutWarningsNestedInput = {
    create?: XOR<UserCreateWithoutWarningsInput, UserUncheckedCreateWithoutWarningsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWarningsInput
    upsert?: UserUpsertWithoutWarningsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWarningsInput, UserUpdateWithoutWarningsInput>, UserUncheckedUpdateWithoutWarningsInput>
  }

  export type GiveawayCreateparticipantsInput = {
    set: string[]
  }

  export type GiveawayCreatewinnersInput = {
    set: string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type GiveawayUpdateparticipantsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GiveawayUpdatewinnersInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type WarningCreateWithoutUserInput = {
    id?: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUncheckedCreateWithoutUserInput = {
    id?: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningCreateOrConnectWithoutUserInput = {
    where: WarningWhereUniqueInput
    create: XOR<WarningCreateWithoutUserInput, WarningUncheckedCreateWithoutUserInput>
  }

  export type WarningCreateManyUserInputEnvelope = {
    data: WarningCreateManyUserInput | WarningCreateManyUserInput[]
  }

  export type WarningUpsertWithWhereUniqueWithoutUserInput = {
    where: WarningWhereUniqueInput
    update: XOR<WarningUpdateWithoutUserInput, WarningUncheckedUpdateWithoutUserInput>
    create: XOR<WarningCreateWithoutUserInput, WarningUncheckedCreateWithoutUserInput>
  }

  export type WarningUpdateWithWhereUniqueWithoutUserInput = {
    where: WarningWhereUniqueInput
    data: XOR<WarningUpdateWithoutUserInput, WarningUncheckedUpdateWithoutUserInput>
  }

  export type WarningUpdateManyWithWhereWithoutUserInput = {
    where: WarningScalarWhereInput
    data: XOR<WarningUpdateManyMutationInput, WarningUncheckedUpdateManyWithoutUserInput>
  }

  export type WarningScalarWhereInput = {
    AND?: WarningScalarWhereInput | WarningScalarWhereInput[]
    OR?: WarningScalarWhereInput[]
    NOT?: WarningScalarWhereInput | WarningScalarWhereInput[]
    id?: StringFilter<"Warning"> | string
    userId?: StringFilter<"Warning"> | string
    moderatorId?: StringFilter<"Warning"> | string
    reason?: StringFilter<"Warning"> | string
    createdAt?: DateTimeFilter<"Warning"> | Date | string
  }

  export type UserCreateWithoutWarningsInput = {
    id: string
    bank?: number
    wallet?: number
    lastDaily?: Date | string | null
    lastWork?: Date | string | null
    lastRob?: Date | string | null
    lastCrime?: Date | string | null
    inventory?: InputJsonValue
    investments?: InputJsonValue
    dailyStreak?: number
    xp?: number
    level?: number
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutWarningsInput = {
    id: string
    bank?: number
    wallet?: number
    lastDaily?: Date | string | null
    lastWork?: Date | string | null
    lastRob?: Date | string | null
    lastCrime?: Date | string | null
    inventory?: InputJsonValue
    investments?: InputJsonValue
    dailyStreak?: number
    xp?: number
    level?: number
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutWarningsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWarningsInput, UserUncheckedCreateWithoutWarningsInput>
  }

  export type UserUpsertWithoutWarningsInput = {
    update: XOR<UserUpdateWithoutWarningsInput, UserUncheckedUpdateWithoutWarningsInput>
    create: XOR<UserCreateWithoutWarningsInput, UserUncheckedCreateWithoutWarningsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWarningsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWarningsInput, UserUncheckedUpdateWithoutWarningsInput>
  }

  export type UserUpdateWithoutWarningsInput = {
    bank?: FloatFieldUpdateOperationsInput | number
    wallet?: FloatFieldUpdateOperationsInput | number
    lastDaily?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastWork?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCrime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inventory?: InputJsonValue | InputJsonValue
    investments?: InputJsonValue | InputJsonValue
    dailyStreak?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutWarningsInput = {
    bank?: FloatFieldUpdateOperationsInput | number
    wallet?: FloatFieldUpdateOperationsInput | number
    lastDaily?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastWork?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastCrime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inventory?: InputJsonValue | InputJsonValue
    investments?: InputJsonValue | InputJsonValue
    dailyStreak?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    level?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningCreateManyUserInput = {
    id?: string
    moderatorId: string
    reason: string
    createdAt?: Date | string
  }

  export type WarningUpdateWithoutUserInput = {
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningUncheckedUpdateWithoutUserInput = {
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WarningUncheckedUpdateManyWithoutUserInput = {
    moderatorId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}