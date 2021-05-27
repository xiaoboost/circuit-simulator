import { PartData, LineData } from 'src/components/electronics';

/** 时间配置接口 */
export interface TimeConfig {
  end: string;
  step: string;
}

/** 器件数据 */
export type ElectronicsData = Array<PartData | LineData>;

/** 电路数据 */
export interface CircuitStorage {
  time?: TimeConfig;
  oscilloscopes?: string[][];
  electronics: ElectronicsData;
}
