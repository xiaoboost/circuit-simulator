import { Point, PointInput } from '@circuit/algorithm';
import {
  LineMark,
  LineCoverMark,
  LineAndPointMark,
  LineCrossMark,
  LinePointMark,
  PartPinMark,
  PartPinLineMark,
  MarkKind,
  Mark,
  MarkMap,
} from '../../../../types';
import * as Connection from '../connection';
import * as Map from '../map';
import {
  isPartPin,
  isLine,
  isLineCover,
  isLineCross,
  isLinePoint,
  isPartPinLine,
  isLineAndPoint,
} from './asserts';

/** 是否包含导线 */
export function hasLine(data: LineAndPointMark, line: string) {
  if ('lines' in data) {
    return data.lines.includes(line);
  }

  if ('line' in data) {
    return data.line === line;
  }

  return data.id === line;
}

/** 添加连接 */
export function addConnect(data: Exclude<LineAndPointMark, LineCoverMark>, next: Point): void;
export function addConnect(data: LineCoverMark, next: Point, line: string): void;
export function addConnect(data: LineAndPointMark, next: Point, line?: string): void;
export function addConnect(data: LineAndPointMark, next: Point, line?: string) {
  if (data.kind === MarkKind.LineCover) {
    if (!line) {
      throw new Error('交叠节点必须指定导线');
    }

    let connection = data.connections[line];

    if (!connection) {
      connection = {};
      data.connections[line] = connection;
    }

    Connection.add(data.position, next, connection);
  }
  else {
    Connection.add(data.position, next, data.connection);
  }
}

/** 删除连接 */
export function deleteConnect(data: LineAndPointMark, next: Point) {
  if (data.kind === MarkKind.LineCover) {
    Object.values(data.connections).forEach((item) => {
      return Connection.remove(data.position, next, item);
    });
  }
  else {
    Connection.remove(data.position, next, data.connection);
  }
}

/** 是否包含连接 */
export function hasConnect(data: LineAndPointMark, next: Point) {
  if (data.kind === MarkKind.LineCover) {
    return Object.values(data.connections).some((item) => {
      return Connection.has(data.position, next, item);
    });
  }
  else {
    return Connection.has(data.position, next, data.connection);
  }
}

/**
 * 包含直线通路
 *
 * @description 只要直线上有连接，则认为包含直线通路
 */
export function hasStraightLine(data: LineAndPointMark) {
  const connections = data.kind === MarkKind.LineCover
    ? Object.values(data.connections)
    : [data.connection];

  return connections.some(({ left, right, top, bottom }) => {
    return (left && right) || (top && bottom);
  });
}

/** 删除引脚 */
export function deletePin(data: PartPinLineMark): LinePointMark {
  return {
    kind: MarkKind.LinePoint,
    id: data.id,
    position: Point.from(data.position),
    connection: {
      ...data.connection,
    },
  };
}

export function isFullCross(data: LineCrossMark) {
  return Connection.isFull(data.connection);
}

export function isNoConnect(data: Mark) {
  if (!isLineAndPoint(data)) {
    return false;
  }

  if (isLineCover(data)) {
    return Object.values(data.connections).every((item) => {
      return !item.left && !item.right && !item.top && !item.bottom;
    });
  }

  const { connection: item } = data;
  return !item.left && !item.right && !item.top && !item.bottom;
}

/** 删除器件引脚连接导线节点中的导线部分 */
export function deletePartInPartPinLine(data: PartPinLineMark): LinePointMark {
  return {
    kind: MarkKind.LinePoint,
    id: data.line,
    position: Point.from(data.position),
    connection: {
      ...data.connection,
    },
  };
}

/**
 * 删除导线
 *
 * @description 仅操作节点，并不会删除连接
 */
export function deleteLine(data: PartPinLineMark): PartPinMark;
export function deleteLine(data: LineCoverMark, line: string): LineMark;
export function deleteLine(
  data: LineCrossMark,
  line: string,
  map: MarkMap,
): LineCrossMark | LinePointMark;
export function deleteLine(
  data: PartPinLineMark | LineCoverMark | LineCrossMark,
  line?: string,
  map?: MarkMap,
): Mark {
  if (isLineCover(data)) {
    if (!line) {
      throw new Error('交叠节点必须指定导线');
    }

    const restLine = data.lines.find((item) => item !== line);

    if (!restLine) {
      throw new Error('删除的导线不存在');
    }

    return {
      kind: MarkKind.Line,
      id: restLine,
      position: data.position,
      connection: {
        ...data.connections[restLine],
      },
    };
  }
  else if (isLineCross(data)) {
    if (!map) {
      throw new Error('交错节点必须指定图纸数据');
    }

    if (!line) {
      throw new Error('交错节点必须指定导线');
    }

    const { lines } = data;
    const index = lines.findIndex((item) => item === line);

    if (index === -1) {
      throw new Error('删除的导线不存在');
    }

    lines.splice(index, 1);

    // 当前仍然是大于一个导线，则返回自己
    if (lines.length > 1) {
      return data;
    }
    // 否则退化为导线空节点
    else {
      return {
        kind: MarkKind.LinePoint,
        id: lines[0],
        position: data.position,
        connection: data.connection,
      };
    }
  }
  else if (isPartPinLine(data)) {
    return {
      kind: MarkKind.PartPin,
      id: data.id,
      pin: data.pin,
      position: Point.from(data.position),
    };
  }

  throw new Error('不支持的节点类型');
}

/** 添加导线 */
export function addLine(data: PartPinMark, line: string): PartPinLineMark;
export function addLine(data: LineMark, line: string): LineCoverMark;
export function addLine(data: LineCrossMark, line: string): LineCrossMark;
export function addLine(data: LinePointMark, line: string): LineCrossMark;
export function addLine(
  data: Exclude<LineAndPointMark, LineCoverMark | PartPinLineMark> | PartPinMark,
  line: string,
): Mark {
  if (isPartPin(data)) {
    return {
      kind: MarkKind.PartPinLine,
      id: data.id,
      pin: data.pin,
      line,
      position: Point.from(data.position),
      connection: {},
    };
  }
  else if (isLineCross(data)) {
    if (!data.lines.includes(line)) {
      data.lines.push(line);
    }

    return data;
  }
  else if (isLinePoint(data)) {
    return {
      kind: MarkKind.LineCross,
      lines: [data.id, line],
      position: Point.from(data.position),
      connection: { ...data.connection },
    };
  }
  else if (isLine(data)) {
    return {
      kind: MarkKind.LineCover,
      lines: [data.id, line],
      position: Point.from(data.position),
      connections: { [data.id]: { ...data.connection } },
    };
  }

  throw new Error('不支持的节点类型');
}

/** 前后位置和当前节点是否连通 */
export function inStraightLine(data: LineCoverMark, next: Point, pre: Point) {
  return Object.values(data.connections).some((item) => {
    return Connection.has(data.position, pre, item) && Connection.has(data.position, next, item);
  });
}

export function alongLineAndVector(
  data: LineAndPointMark,
  vector: PointInput,
  map: MarkMap,
  end?: Point,
) {
  const uVector = Point.from(vector).sign(20);

  let index = 0;
  let current: LineAndPointMark = data;
  let next = Map.get(map, current.position.add(uVector));

  // 当前点没有到达终点，还在导线所在直线内部，那就前进
  while (next && (end ? !current.position.isEqual(end) : true)) {
    if (process.env.NODE_ENV === 'development') {
      index++;
      if (index > 500) {
        throw new Error('计算迭代次数过多，请检查算法内容');
      }
    }

    if (isLineCover(current)) {
      const pre = current.position.add(uVector, -1);

      if (inStraightLine(current, next.position, pre)) {
        current = next as LineAndPointMark;
        next = Map.get(map, current.position.add(uVector));
      }
      else {
        break;
      }
    }
    else {
      if (hasConnect(current, next.position)) {
        current = next as LineAndPointMark;
        next = Map.get(map, current.position.add(uVector));
      }
      else {
        break;
      }
    }
  }

  return current;
}
