/** 转换器 */
export type Transformer = (code: string, resourcePath: string) => string | Promise<string>;
