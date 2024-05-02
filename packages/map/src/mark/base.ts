import { Point } from '@circuit/math';
import type { MarkMap } from '../map';
import type { LineMark } from './line';
import type { LinePointMark } from './line-point';
import type { LineCoverMark } from './line-cover';
import type { LineCrossMark } from './line-cross';
import type { PartMark } from './part';
import type { PartPinMark } from './part-pin';
import type { PartPinLineMark } from './part-pin-line';
import { MarkKind, DataWithPosition, Mark } from './types';

/** 节点数据 */
export abstract class BaseMark {
  readonly position: Point;

  /** 节点所在图纸 */
  protected readonly map: MarkMap;

  constructor(map: MarkMap, data: DataWithPosition) {
    this.map = map;
    this.position = Point.from(data.position);
    this.map.set(this.position, this as any);
  }

  /** 节点类别 */
  get kind() {
    return Object.getPrototypeOf(this).constructor.MarkKind as MarkKind;
  }

  get kindName() {
    return MarkKind[this.kind] as keyof typeof MarkKind;
  }

  /** 是否在图中 */
  get inMap() {
    const markInMap = this.map.get(this.position);

    return markInMap
      ? markInMap === (this as unknown as Mark)
      : false;
  }

  /** 导线 */
  isLine(this: Mark): this is LineMark {
    return this.kind === MarkKind.Line;
  }

  /** 导线端点 */
  isLinePoint(this: Mark): this is LinePointMark {
    return this.kind === MarkKind.LinePoint;
  }

  /** 交叠节点 */
  isLineCover(this: Mark): this is LineCoverMark {
    return this.kind === MarkKind.LineCover;
  }

  /** 交错节点 */
  isLineCross(this: Mark): this is LineCrossMark {
    return this.kind === MarkKind.LineCross;
  }

  /** 器件节点 */
  isPart(this: Mark): this is PartMark {
    return this.kind === MarkKind.Part;
  }

  /** 器件引脚节点 */
  isPartPin(this: Mark): this is PartPinMark {
    return this.kind === MarkKind.PartPin;
  }

  /** 器件引脚连接导线节点 */
  isPartPinLine(this: Mark): this is PartPinLineMark {
    return this.kind === MarkKind.PartPinLine;
  }

  /** 输出数据 */
  toData() {
    return {
      kind: this.kind,
      position: this.position.toData(),
    } as any;
  }
}
