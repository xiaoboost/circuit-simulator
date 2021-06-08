import { SimulationConfig } from 'src/components/side-menu';
import { PartData, LineData } from '@circuit/electronics';

/** 器件数据 */
export type ElectronicData = (PartData | LineData)[];

/** 电路数据 */
export interface CircuitData {
  simulation?: SimulationConfig;
  oscilloscopes?: string[][];
  electronics?: ElectronicData;
}
