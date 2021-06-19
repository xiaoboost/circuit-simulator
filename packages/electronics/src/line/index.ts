import { Electronic } from '../base';
import { LinePath } from './path';
import { LineData, LinePin, LinePinStatus } from './types';
import { ElectronicKind } from '../types';
import { debug } from '@circuit/debug';
import { MarkNodeKind, MarkMapNode } from '@circuit/map';
import { PointLike, Point } from '@circuit/math';
import { isBoolean, isUndef, delay, ConstructorParameters } from '@xiao-ai/utils';

import type { Part } from '../part';

export * from './types';
export * from './path';

export class Line extends Electronic {
  constructor(paths: PointLike[] = []) {
    super(ElectronicKind.Line);
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
        isConnected: Boolean(this.connections[i]),
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
  split(id: string, pin: LinePin) {
    // const splited = findLineComponent(id);
    // const crossPoint = Point.from(this.way.get(-1 * index));

    // // 验证拆分点是否在拆分路径上
    // let crossSub = -1;
    // for (let i = 0; i < splited.way.length - 1; i++) {
    //     if (crossPoint.isInLine([splited.way[i], splited.way[i + 1]])) {
    //         crossSub = i;
    //         break;
    //     }
    // }

    // if (crossSub < -1) {
    //     throw new Error('(line) split line failed.');
    // }

    // // 先删除被分割导线的所有标记
    // splited.deleteSign();

    // // 生成临时导线
    // const Comp = Vue.extend(LineComponent);
    // const devices = new Comp<LineComponent>();

    // // devices 连接关系设定
    // splited.replaceConnect(1, devices.id);                  // splited 原终点器件连接替换为 devices
    // devices.connect[1] = splited.connect[1];                // 原导线起点不变，新导线的终点等于原导线的终点
    // devices.connect[0] = `${splited.id} ${this.id}`;        // 新导线起点由旧导线 ID 和分割旧导线的导线 ID 组成

    // // devices 路径为交错点至原 splited 终点
    // devices.way = LineWay.from(splited.way.slice(crossSub + 1));
    // devices.way.unshift(crossPoint);
    // LineWay.prototype.checkWayRepeat.call(devices.way);

    // // splited 的终点连接变更
    // splited.connect[1] = `${devices.id} ${this.id}`;

    // // splited 路径变更为起点至交错点部分
    // splited.way = LineWay.from(splited.way.slice(0, crossSub + 1));
    // splited.way.push(crossPoint);
    // LineWay.prototype.checkWayRepeat.call(splited.way);

    // // 当前导线端点连接为拆分而成的两个导线
    // this.connect[index] = `${splited.id} ${devices.id}`;    // 分割旧导线的导线终点由新旧导线 ID 组成

    // // 交错节点设定
    // Map.setPoint({
    //     type: Map.NodeType.LineCrossPoint,
    //     point: crossPoint.floorToSmall(),
    //     id: `${this.id} ${splited.id} ${devices.id}`,
    //     connect: [],
    // });

    // // 标记图纸
    // this.markSign();
    // splited.markSign();
    // devices.markSign();

    // // 更新数据
    // this.dispatch();
    // splited.dispatch();

    // // 加载临时导线
    // this.$store.commit(Mutation.PUSH_LINE, copyProperties(devices, disptchKeys));

    // // 销毁临时导线
    // devices.$destroy();
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
      else if (current.isLine || current.kind === MarkNodeKind.PartPin) {
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
  setConnectByPin(concat?: boolean): void;
  /**
  * 由引脚信息设置导线端点连接
  * @param {LinePin} [index] 需要设定的引脚
  * @param {boolean} [concat=true] 是否合并浮动导线
  */
  setConnectByPin(pin?: LinePin, concat?: boolean): void;
  setConnectByPin(pin?: LinePin | boolean, concat = true) {
    if (isBoolean(pin)) {
      this.setConnectByPin(LinePin.Start, pin);
      this.setConnectByPin(LinePin.End, pin);
      return;
    }
    else if (isUndef(pin)) {
      this.setConnectByPin(0);
      this.setConnectByPin(1);
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

      status.labels.add(this.id, index);

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

        status.labels.add(this.id, index);
        line.setConnection(mark, {
          id: this.id,
          mark: index,
        });
        this.setConnection(index, {
          id: line.id,
          mark: mark,
        });

        line.updateView();
        this.updateView();
      }
    }
    // // 端点在交错节点
    // else if (status.kind === MarkNodeKind.LineCrossPoint) {
    //   status.deleteLabel(this.id, index);

    //   // 只有一个导线
    //   if (status.labels.length === 1 && concat) {
    //     this.concat(status.label.id);
    //   }
    //   else {
    //     this.connections[index] = lines;

    //     lines.split(' ').forEach((id) => {
    //       const line = findLineComponent(id);
    //       const mark = line.findConnectIndex(node);
    //       const connect = deleteMark(lines, line.id);

    //       if (mark !== -1) {
    //         line.connect[mark] = mergeMark(connect, this.id);
    //         line.dispatch();
    //       }
    //     });

    //     status.id = mergeMark(status.id, this.id);
    //     Map.mergePoint(status);
    //   }
    // }
  }

  /** 导线反转 */
  reverse() {
    const oldConnections = this.connections.slice();

    this.setDeepConnection(0, oldConnections[1]);
    this.setDeepConnection(1, oldConnections[0]);
    this.path.reverse();

    const points = [this.path[0], this.path.get(-1)];

    // 变更端点的数据记录
    for (let i = 0; i < 2; i++) {
      const data = this.map.get(points[i]);

      if (data) {
        data.labels.delete(this.id, i);
        data.labels.add(this.id, 1 - i);
      }
    }
  }

  /** 输出数据 */
  toData(): Required<LineData> {
    return {
      kind: 'Line',
      path: this.path.toData(),
    };
  }
}
