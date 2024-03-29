import { Electronic } from '../base';
import { LinePath } from './path';
import { LineData, LinePin, LinePinStatus, LineStructuredData } from './types';
import { ElectronicKind, Context } from '../types';
import { debug } from '@circuit/debug';
import { MarkNodeKind, MarkMapNode, Label } from '@circuit/map';
import { PointLike, Point } from '@circuit/math';
import { isLine } from '@circuit/shared';
import { isBoolean, isUndef, delay, ConstructorParameters } from '@xiao-ai/utils';

import type { Part } from '../part';

export * from './types';
export * from './path';

export class Line extends Electronic {
  constructor(paths: PointLike[] = [], context?: Context) {
    super(ElectronicKind.Line, context);
    this.path = LinePath.from(paths);
  }

  private _path!: LinePath;
  private _points: LinePinStatus[] = [];

  /** 导线路径 */
  get path() {
    return this._path;
  }
  set path(val: LinePath) {
    this._path = val;
    this.updatePoints();
  }
  /** 导线引脚状态 */
  get points() {
    return this._points;
  }

  protected updatePoints() {
    if (this.path.length === 0) {
      this._points = [];
    }

    for (let i = 0; i < 2; i++) {
      const position = this.path[i * (this.path.length - 1)];
      const oldData = this._points[i];

      this._points[i] = {
        ...oldData,
        index: i,
        position,
        status: this.connections[i].getStatus(),
      };
    }

    this.updateView();
  }

  /** 创建新导线 */
  create(...args: ConstructorParameters<typeof Line>) {
    return new Line(...args);
  }

  /**
   * 拆分导线
   * @param {string} id 被拆分导线的 id
   * @param {LinePin} index 当前导线的起点/终点作为分割点
   */
  split(id: string, pin: LinePin.Start | LinePin.End) {
    /** 被切分的导线 */
    const splitLine = this.find<Line>(id)!;
    /** 分割点坐标 */
    const crossPoint = Point.from(this.path.get(-1 * pin));
    /** 分割点在被分割导线的第几个线段 */
    const crossSub = (() => {
      for (let i = 0; i < splitLine.path.length - 1; i++) {
        if (crossPoint.isInLine([splitLine.path[i], splitLine.path[i + 1]])) {
          return i;
        }
      }
    })();

    if (isUndef(crossSub)) {
      throw new Error(`分割导线失败`);
    }

    // 删除被分割导线的所有标记
    splitLine.deleteMark();

    // 生成新导线
    const newLine = this.create([[1e6, 1e6]]);

    // 新导线终点连接替代被分割导线终点连接
    newLine.setDeepConnection(1, splitLine.connections[1]);
    // 新导线起点由被分割导线终点和分割旧导线的导线组成
    newLine.setDeepConnection(0, [
      {
        id: splitLine.id,
        mark: 1,
      },
      {
        id: this.id,
        mark: pin,
      },
    ]);
    // 被分割导线终点连接变更
    splitLine.setDeepConnection(1, [
      {
        id: newLine.id,
        mark: 0,
      },
      {
        id: this.id,
        mark: pin,
      },
    ]);

    // 新导线路径为交错点至被分割导线终点
    newLine.path = LinePath.from(splitLine.path.slice(crossSub + 1));
    newLine.path.unshift(crossPoint);
    newLine.path.removeRepeat();

    // 被分割导线路径变更为起点至交错点部分
    splitLine.path = LinePath.from(splitLine.path.slice(0, crossSub + 1));
    splitLine.path.push(crossPoint);
    splitLine.path.removeRepeat();

    // 更新节点
    this.updatePoints();
    splitLine.updatePoints();
    newLine.updatePoints();

    // 标记图纸
    this.setMark();
    splitLine.setMark();
    newLine.setMark();

    // 更新视图
    this.updateView();
    splitLine.updateView();
    newLine.updateView();
  }

  /** 合并导线 */
  concat(id: string) {
    const line = this.find<Line>(id);

    if (!line) {
      throw new Error(`导线合并失败，未发现编号：'${id}'的导线。`);
    }

    /** 连接点 */
    let crossIndex: 0 | 1 = 0;

    // 连接导线的路径
    if (this.path[0].isEqual(line.path[0])) {
      line.reverse();
      crossIndex = 0;
    }
    else if (this.path[0].isEqual(line.path.get(-1))) {
      crossIndex = 0;
    }
    else if (this.path.get(-1).isEqual(line.path.get(-1))) {
      line.reverse();
      crossIndex = 1;
    }
    else {
      crossIndex = 1;
    }

    this.setConnection(crossIndex, line.connections[crossIndex]);
    this.path = LinePath.from(
      crossIndex === 0
        ? line.path.concat(this.path)
        : this.path.concat(line.path)
    ).removeRepeat();

    line.delete();
    this.updateView();
    this.setMark();
  }

  /** 设置标志位 */
  setMark() {
    const { path, map } = this;

    let last: MarkMapNode | undefined;
    let current: MarkMapNode | undefined;

    for (const point of path.forEachPoint()) {
      current = map.get(point);

      const index = this.points.findIndex((item) => item.position.isEqual(point));

      if (!current) {
        current = map.set({
          position: point,
          id: this.id,
          mark: index,
        });
      }
      else if (current.kind === MarkNodeKind.PartPin) {
        // 过滤掉所有非器件连接
        current.labels = current.labels.filter((item) => !isLine(item.id)) as Label;
        current.labels.add(this.id, index);
      }
      else if (current.isLine) {
        // 过滤掉所有当前器件已经标记的点
        current.labels = current.labels.filter((item) => item.id !== this.id) as Label;
        current.labels.add(this.id, index);
      }
      else {
        const info = `Illegal point(${point.join(',')}): ${MarkNodeKind[current.kind]}`;

        if (process.env.NODE_ENV === 'development') {
          debug.point(point, 'red');
          throw new Error(info);
        }
        else {
          console.error(info);
          return;
        }
      }

      if (last && current) {
        last.connections.add(current.position);
        current.connections.add(last.position);
      }

      last = current;
    }
  }

  /** 删除标记 */
  deleteMark() {
    const { id, path, map } = this;

    let lastPoint: Point | undefined;
    let lastNode: MarkMapNode | undefined;
    let current: MarkMapNode | undefined;

    for (const point of path.forEachPoint()) {
      current = map.get(point);

      const index = this.points.findIndex((item) => item.position.isEqual(point));

      if (lastNode) {
        lastNode.connections.delete(point);
      }

      if (current && lastPoint) {
        current.connections.delete(lastPoint);
      }

      if (!current) {
        continue;
      }

      // 普通点
      if (
        current.kind === MarkNodeKind.Line ||
        current.kind === MarkNodeKind.LineSpacePoint
      ) {
        map.delete(point);
      }
      // 交错/覆盖节点
      else if (
        current.kind === MarkNodeKind.LineCoverPoint ||
        current.kind === MarkNodeKind.LineCrossPoint ||
        current.kind === MarkNodeKind.PartPin
      ) {
        current.labels.delete(id, index);

        if (!current.labels.value) {
          map.delete(point);
        }
      }

      lastPoint = point;
      lastNode = current;
    }
  }

  /**
   * 由引脚信息设置导线两端连接
   * @param {boolean} [concat=true] 是否合并浮动导线
   */
  setConnectionByPath(concat?: boolean): void;
  /**
  * 由引脚信息设置导线端点连接
  * @param {LinePin} [index] 需要设定的引脚
  * @param {boolean} [concat=true] 是否合并浮动导线
  */
  setConnectionByPath(pin?: LinePin.Start | LinePin.End, concat?: boolean): void;
  setConnectionByPath(pin?: LinePin.Start | LinePin.End | boolean, concat = true) {
    if (isBoolean(pin)) {
      this.setConnectionByPath(LinePin.Start, pin);
      this.setConnectionByPath(LinePin.End, pin);
      return;
    }
    else if (isUndef(pin)) {
      this.setConnectionByPath(0);
      this.setConnectionByPath(1);
      return;
    }

    const index = pin === LinePin.Start ? 0 : 1;
    const node = this.path.get(-1 * index).round();
    const status = this.map.get(node);

    // 端点为空
    if (!status) {
      this.setConnection(index);
    }
    // 端点为器件引脚
    else if (status.kind === MarkNodeKind.PartPin) {
      const label = status.labels.value!;
      const part = this.find<Part>(label.id)!;
      const mark = label.mark!;

      this.setDeepConnection(index, {
        id: part.id,
        mark: mark,
      });
    }
    // 端点在导线上
    else if (status.kind === MarkNodeKind.Line) {
      if (this.hasConnection(status.labels.value!.id, status.labels.value!.mark)) {
        /**
         * 因为`setConnectByPin`函数运行之后可能还有后续动作
         * 所以这里需要等待一个更新周期
         */
        delay().then(() => this.delete());
      }
      else {
        this.split(status.labels.value!.id, pin);
      }
    }
    // 端点为导线空引脚
    else if (status.kind === MarkNodeKind.LineSpacePoint) {
      const { id, mark } = status.labels.value!;

      // 允许合并
      if (concat) {
        this.concat(id);
      }
      // 不允许合并，则该点变更为交错节点
      else {
        const line = this.find<Line>(id)!;

        this.setDeepConnection(index, {
          id: line.id,
          mark: mark,
        });

        line.updateView();
        this.updateView();
      }
    }
    // 端点在交错节点
    else if (status.kind === MarkNodeKind.LineCrossPoint) {
      // 排除当前导线节点
      const restLabels = status.labels.filter((label) => {
        return label.id !== this.id || label.mark !== index;
      });

      // 只有一个导线
      if (concat && restLabels.length === 1) {
        this.concat(restLabels[0].id);
      }
      else {
        const allLabels = status.labels.toData().concat({
          id: this.id,
          mark: pin,
        });

        status.labels.forEach(({ id, mark }) => {
          const line = this.find<Line>(id);

          if (!line) {
            throw new Error(`导线不存在：${id}`);
          }

          const lineConnection = allLabels.filter((item) => item.id !== id || item.mark !== mark);
          line.setDeepConnection(mark, lineConnection);
        });
      }
    }
  }

  /** 导线反转 */
  reverse() {
    const oldConnections = this.connections.map((item) => item.toData());

    this.setDeepConnection(0, oldConnections[1]);
    this.setDeepConnection(1, oldConnections[0]);
    this.path.reverse();

    // [原终点, 原起点]
    const points = [this.path[0], this.path.get(-1)];

    // 变更端点的数据记录
    for (let i = 0; i < 2; i++) {
      const data = this.map.get(points[i]);

      if (data) {
        data.labels.delete(this.id, 1 - i);
        data.labels.add(this.id, i);
      }
    }

    this.updatePoints();
  }

  /** 输出数据 */
  toData(): Required<LineData> {
    return {
      kind: 'Line',
      path: this.path.toData(),
    };
  }

  /** 输出数据 */
  toStructuredData(): LineStructuredData {
    return {
      id: this.id,
      kind: ElectronicKind.Line,
      path: this.path.toData(),
      connections: this.connections.map((item) => item.toData()),
    };
  }
}
