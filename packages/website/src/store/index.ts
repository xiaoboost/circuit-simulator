import { CircuitStorage, PartStorageData } from './types';
import { Line, Part, ElectronicKind, dispatch } from 'src/components/electronics';

export * from './types';

export function load(data: CircuitStorage) {
  // 加载期间
  for (const item of data.electronics) {
    if (item.kind === 'Line') {
      // ..
    }
    else {
      new Part(item as PartStorageData)
        .setSign();
    }
  }

  dispatch();
}
