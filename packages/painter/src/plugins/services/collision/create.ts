import {
  Rect,
  Direction,
  DirectionVectorSet,
  MarginBox,
  Point,
} from '@circuit/algorithm';
import {
  getPartPrototype,
  getPartPins,
  LINE_THICKNESS,
  PIN_SIZE,
} from '@circuit/electronics';
import {
  LineStructuredData,
  PartStructuredData,
  LineOrPartStructuredData,
} from '@circuit/types';
import {
  IEntityRegion,
} from '../../../types';

/** 获取器件外边框四边框 */
function getPartRectWithRotate(data: PartStructuredData): Rect[] {
  const rects: Rect[] = [];
  const { margin } = getPartPrototype(data.kind);
  const MarginDirection = [
    Direction.Top,
    Direction.Right,
    Direction.Bottom,
    Direction.Left,
  ];
  const marginVector = MarginDirection
    .map((di, i) => DirectionVectorSet[di].mul(margin[i]))
    .map((v) => data.rotate ? v.rotate(data.rotate) : v)
    .map((v) => ({
      direction: v.toDirection(),
      value: v.abs().product([1, 1]),
    }));

  const rotatedMargin = MarginDirection.map((di) => {
    const result = marginVector.find((v) => v.direction === di);

    if (!result) {
      throw new Error('外边框计算错误，请检查器件是否正确');
    }

    return result.value;
  }) as MarginBox;

  rects.push({
    x: data.position[0] - rotatedMargin[3],
    y: data.position[1] - rotatedMargin[0],
    width: rotatedMargin[1] + rotatedMargin[3],
    height: rotatedMargin[2] + rotatedMargin[0],
  });

  for (const pin of getPartPins(data)) {
    rects.push(getPinRect(pin.position));
  }

  return rects;
}

/** 获取器件引脚四边框 */
function getPinRect(position: Point): Rect {
  return {
    x: position[0] - PIN_SIZE / 2,
    y: position[1] - PIN_SIZE / 2,
    width: PIN_SIZE,
    height: PIN_SIZE,
  };
}

/** 获取连线实体的碰撞矩形 */
function getLineEntityRects({ path }: LineStructuredData): Rect[] {
  const rects: Rect[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const left = Math.min(start[0], end[0]);
    const top = Math.min(start[1], end[1]);
    const right = Math.max(start[0], end[0]);
    const bottom = Math.max(start[1], end[1]);

    rects.push({
      x: left - LINE_THICKNESS / 2,
      y: top - LINE_THICKNESS / 2,
      height: (left === right) ? bottom - top + LINE_THICKNESS : LINE_THICKNESS,
      width: (left === right) ? LINE_THICKNESS : right - left + LINE_THICKNESS,
    });
  }

  rects.push(getPinRect(path[0]));
  rects.push(getPinRect(path[path.length - 1]));

  return rects;
}

/**
 * 获取实体的碰撞矩形
 * @param entity 实体
 * @returns 碰撞矩形
 */
export function getRectByEntity(entity: LineOrPartStructuredData): IEntityRegion {
  if ('kind' in entity) {
    return {
      id: entity.id,
      rects: getPartRectWithRotate(entity),
    };
  }
  else {
    return {
      id: entity.id,
      rects: getLineEntityRects(entity),
    };
  }
}
