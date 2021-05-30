import { CircuitStorage, SimulationConfig, ElectronicsData } from './types';
import { Watcher } from '@xiao-ai/utils';

import {
  Line,
  Part,
  LineData,
  PartData,
  ElectronicKind,
  dispatch,
} from 'src/components/electronics';

export * from './types';

// export const simulationConfig = new Watcher<SimulationConfig>({

// });

export function load(data: CircuitStorage) {
  // 加载期间
  for (const item of data.electronics) {
    if (item.kind === 'Line') {
      // ..
    }
    else {
      new Part(item as PartData).setSign();
    }
  }

  dispatch();
}
