import { PartData, LineData } from 'src/components/electronics';
import { SimulationConfig } from 'src/components/side-menu';

/** 器件数据 */
export type ElectronicsData = Array<PartData | LineData>;

export { SimulationConfig };

/** 电路数据 */
export interface CircuitStorage {
  time?: SimulationConfig;
  oscilloscopes?: string[][];
  electronics: ElectronicsData;
}
