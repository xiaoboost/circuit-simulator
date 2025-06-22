import { type IConnectionData } from '@circuit/shared';

/** 连接关系映射 */
export type IConnectionMap = Map<string, Map<number, IConnectionData[]>>;
