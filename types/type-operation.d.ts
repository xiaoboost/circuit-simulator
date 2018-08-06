/** combine interface */
declare type Combine<T extends object> = { [P in keyof T]: T[P] };

/** Ignoring some properties in an interface */
declare type Omit<T, K extends keyof T> = Combine<Pick<T, Exclude<keyof T, K>>>;

/** To overwrite a read-only interface as writable */
declare type Writeable<T extends object, K extends keyof T> = Combine<Omit<T, K> & { -readonly [P in K]: T[P] }>;

/** Overwrite some property types in an interface */
declare type Overwrite<T extends object, K extends object> = Combine<Omit<T, Extract<keyof T, keyof K>> & K>;

/** return parameters type of function */
declare type Parameters<T extends Function> = T extends (...args: infer R) => any ? R : never;
