import { Point, PointLike } from '@circuit/algorithm';
import type { MarkMap } from '../map';
import { BaseMark } from './base';
import { Connection } from './connection';
import { DataWithPosition, LineAndPointMark, MarkStructureData } from './types';

export interface BaseLineData {
  /** 导线编号 */
  line: string;
  /** 连接数据 */
  connection?: number[];
}

export abstract class BaseLineMark extends BaseMark {
  readonly line: string;
  readonly connection: Connection;

  constructor(map: MarkMap, data: DataWithPosition<BaseLineData>) {
    super(map, data);
    this.line = data.line;
    this.connection = new Connection(this.position);

    if (data.connection) {
      this.connection.fromData(data.connection);
    }
  }

  /** 直线导线 */
  get isStraight() {
    const { connection: { left, right, top, bottom } } = this;

    return Boolean(
      (left && right && !top && !bottom) ||
      (!left && !right && top && bottom),
    );
  }

  hasLine(line: string) {
    return this.line === line;
  }

  isConnect(point: Point) {
    return this.connection.has(point);
  }

  addConnect(point: Point, _?: string) {
    return this.connection.add(point);
  }

  deleteConnect(point: Point, _?: string) {
    return this.connection.delete(point);
  }

  /** 沿导线方向的最远点 */
  alongLineAndVector(this: LineAndPointMark, vector: PointLike, end?: PointLike): LineAndPointMark {
    const map = (this as any).map as MarkMap;
    const uVector = Point.from(vector).sign(20);

    let index = 0;
    let current: LineAndPointMark = this;
    let next = map.get(this.position.add(uVector));

    // 当前点没有到达终点，还在导线所在直线内部，那就前进
    while (next && (end ? current.position.isEqual(end) : true)) {
      if (process.env.NODE_ENV === 'development') {
        index++;
        if (index > 500) {
          throw new Error('计算迭代次数过多，请检查算法内容');
        }
      }

      if (current.isLineCover()) {
        const pre = this.position.add(uVector, -1);

        if (current.isConnectWithPrePoint(next.position, pre)) {
          current = next as LineAndPointMark;
          next = map.get(current.position.add(uVector));
        }
        else {
          break;
        }
      }
      else {
        if (current.isConnect(next.position)) {
          current = next as LineAndPointMark;
          next = map.get(current.position.add(uVector));
        }
        else {
          break;
        }
      }
    }

    return current;
  }

  toData(): MarkStructureData {
    return {
      ...super.toData(),
      line: this.line,
      connection: this.connection.toData(),
    };
  }
}
