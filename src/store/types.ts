import type { ElectronicKind } from 'src/components/electronics';
import type { Direction } from 'src/math';

/** 时间配置接口 */
export interface TimeConfig {
  end: string;
  step: string;
}

/** 储存用的器件数据接口 */
export interface PartStorageData {
  kind: keyof typeof ElectronicKind;
  position: number[];
  rotate?: number[][];
  text?: keyof typeof Direction;
  params?: string[];
}

/** 储存用的器件数据接口 */
export interface LineStorageData {
  kind: keyof typeof ElectronicKind;
  path: number[][];
}

/** 器件数据 */
export type ElectronicsData = Array<PartStorageData | LineStorageData>;

/** 电路数据 */
export interface CircuitStorage {
  time?: TimeConfig;
  oscilloscopes?: string[][];
  electronics: ElectronicsData;
}
