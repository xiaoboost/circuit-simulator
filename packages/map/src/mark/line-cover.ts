import { Point, PointLike } from '@circuit/math';
import type { MarkMap } from '../map';
import { BaseMark } from './base';
import { BaseLineMark } from './base-line';
import { Connection } from './connection';
import { DataWithPosition, MarkKind, LineAndPointMark, MarkStructureWrapper } from './types';
import { setClass, getMarkConstructor } from './utils';

export interface LineCoverData {
  /** 导线编号 */
  lines: string[];
  /** 连接数据 */
  connections?: {
    id: string;
    data: number[];
  }[];
}

export type LineCoverStructureData = MarkStructureWrapper<LineCoverData, MarkKind.LineCover>;

@setClass('LineCoverMark')
export class LineCoverMark extends BaseMark implements Omit<BaseLineMark, 'line' | 'connection'> {
  /** 导线节点类别 */
  static MarkKind = MarkKind.LineCover;

  // @ts-expect-error 这里只需要声明，不需要实例化
  declare readonly kind!: MarkKind.LineCover;

  readonly lines: string[];
  readonly connections: Connection[];

  constructor(map: MarkMap, data: DataWithPosition<LineCoverData>) {
    super(map, data);
    this.lines = data.lines;
    this.connections = (data.connections ?? []).map(({ id, data }) => {
      const connection = new Connection(this.position, id);
      connection.fromData(data);
      return connection;
    });
  }

  get isStraight() {
    return false;
  }

  hasLine(line: string) {
    return this.lines.includes(line);
  }

  isConnect(next: Point) {
    return this.connections.some((con) => con.has(next));
  }

  isConnectWithPrePoint(next: Point, pre: Point) {
    return this.connections.some((item) => item.has(pre) && item.has(next));
  }

  addConnect(point: Point, line: string) {
    this.getConnection(line)?.add(point);
  }

  deleteConnect(point: Point, line: string) {
    this.getConnection(line)?.delete(point);
  }

  deleteLine(line: string) {
    const LineMark = getMarkConstructor('LineMark');
    const newMark = new LineMark(this.map, {
      position: this.position,
      line: this.lines.find((item) => item !== line)!,
      connection: this.connections.find((item) => item.id !== line)!.toData(),
    });
    this.map.set(this.position, newMark);
    return newMark;
  }

  alongLineAndVector(this: LineAndPointMark, vector: PointLike, end?: PointLike) {
    return BaseLineMark.prototype.alongLineAndVector.apply(this, [vector, end]);
  }

  getConnection(line: string) {
    if (!this.hasLine(line)) {
      return;
    }

    const connection = this.connections.find((item) => item.id === line);

    if (connection) {
      return connection;
    }

    const newConnection = new Connection(this.position, line);
    this.connections.push(newConnection);
    return newConnection;
  }

  toData(): LineCoverStructureData {
    return {
      kind: this.kind,
      lines: this.lines,
      connections: this.connections.map((item) => ({
        id: item.id as string,
        data: item.toData(),
      })),
      position: this.position.toData(),
    };
  }
}
