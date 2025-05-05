import { Direction } from '@circuit/math';
import { SheetContext } from '../base';
import { ElectronicKind } from '../types';
import { PartMarker } from './mark';
import type { PartData, PartStructuredData } from './types';

export class Part extends PartMarker {
  constructor(kind: ElectronicKind | PartData, context?: SheetContext) {
    super(kind, context);
  }

  /** 输出数据 */
  toStructuredData(): PartStructuredData {
    return {
      id: this.id,
      kind: this.kind,
      position: this.position.toData(),
      rotate: this.rotate.toData() as any,
      params: this.params.slice(),
      textDirection: Direction.Bottom,
      // 器件引脚只可能连接一个导线，所以这里取下标 0 的数据即可
      connections: this.connections.map((item) => item[0]),
    };
  }
}
