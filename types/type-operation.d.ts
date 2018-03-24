/**
 * @see https://github.com/Microsoft/TypeScript/issues/12215
 * @see https://github.com/Microsoft/TypeScript/issues/14829
 * @see https://github.com/Microsoft/TypeScript/issues/15012
 */

/** Remove the variants of the second union of string literals from the first. */
declare type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

/** To overwrite a read-only interface as writable */
declare type Writeable<T extends { [x: string]: any }, K extends string> = Pick<T, Diff<keyof T, K>> & { [P in K]: T[P] };

/** Ignoring some properties in an interface */
declare type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] };

/** Overwrite some property types in an interface */
declare type Overwrite<T, U> = { [P in Diff<keyof T, keyof U>]: T[P] } & U;

/** Use to prevent a usage of type `T` from being inferred in other generics. */
declare type NoInfer<T> = T & { [K in keyof T]: T[K] };

/** `T` without the possibility of `undefined` or `null`. */
declare type NonNullable<T> = T & {};

/** Forgets contextual of partiality of keys. */
declare type Purify<T extends string> = { [P in T]: T; }[T];

/** Make all properties of `T` required and non-nullable. */
declare type Required<T> = {
    [P in Purify<keyof T>]: NonNullable<T[P]>;
};
