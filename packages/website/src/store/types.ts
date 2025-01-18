import type { PartData } from '@circuit/electronics';
// import type { SimulationConfig } from 'src/components/side-menu';

/** 器件数据 */
export type ElectronicData = (PartData | any)[];

/** 示波器设置 */
export type OscilloscopeData = string[][];

/** 电路数据 */
export interface CircuitData {
  simulation?: any;
  oscilloscopes?: OscilloscopeData;
  electronics?: ElectronicData;
}
