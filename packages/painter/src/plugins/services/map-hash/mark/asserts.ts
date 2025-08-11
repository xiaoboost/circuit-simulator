import {
  MarkKind,
  Mark,
  LineMark,
  LinePointMark,
  LineCoverMark,
  LineCrossMark,
  PartMark,
  PartPinMark,
  PartPinLineMark,
  LineAndPointMark,
} from '../../../../types';

  /** 导线 */
export function isLine(mark: Mark): mark is LineMark {
  return mark?.kind === MarkKind.Line;
}

  /** 导线端点 */
export function isLinePoint(mark: Mark): mark is LinePointMark {
  return mark?.kind === MarkKind.LinePoint;
}

  /** 交叠节点 */
export function isLineCover(mark: Mark): mark is LineCoverMark {
  return mark?.kind === MarkKind.LineCover;
}

  /** 交错节点 */
export function isLineCross(mark: Mark): mark is LineCrossMark {
  return mark?.kind === MarkKind.LineCross;
}

  /** 器件节点 */
export function isPart(mark: Mark): mark is PartMark {
  return mark?.kind === MarkKind.Part;
}

  /** 器件引脚节点 */
export function isPartPin(mark: Mark): mark is PartPinMark {
  return mark?.kind === MarkKind.PartPin;
}

  /** 器件引脚连接导线节点 */
export function isPartPinLine(mark: Mark): mark is PartPinLineMark {
  return mark?.kind === MarkKind.PartPinLine;
}

export function isLineAndPoint(mark: Mark): mark is LineAndPointMark {
  return (
    mark &&
    (
      isLine(mark) ||
      isLinePoint(mark) ||
      isLineCover(mark) ||
      isLineCross(mark) ||
      isPartPinLine(mark)
    )
  );
}
