import { type IConnectionData } from '@circuit/contracts/painter';

/** 连接关系映射 */
export type IConnectionMap = Map<string, Map<number, IConnectionData[]>>;
