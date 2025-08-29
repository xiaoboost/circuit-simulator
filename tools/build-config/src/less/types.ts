/** 转换器 */
export type Transformer = (
  code: string,
  rootDir: string,
  resourcePath: string,
) => string | Promise<string>;
