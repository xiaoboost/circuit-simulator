export type AnyObject<T = any> = Record<string, T>;
export type AnyFunction = (...args: any[]) => any;
export type EmptyObject = Record<string, never>;

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends AnyFunction
    ? T
    : T extends AnyObject
      ? DeepReadonlyObject<T>
      : T;

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
