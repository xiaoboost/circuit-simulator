import type { SimulationConfig } from 'src/components/side-menu';
import type { PartData, LineData } from '@circuit/electronics';

/** 器件数据 */
export type ElectronicData = (PartData | LineData)[];

/** 示波器设置 */
export type OscilloscopeData = string[][];

/** 电路数据 */
export interface CircuitData {
  simulation?: SimulationConfig;
  oscilloscopes?: OscilloscopeData;
  electronics?: ElectronicData;
}
