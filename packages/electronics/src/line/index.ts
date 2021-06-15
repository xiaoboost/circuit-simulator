import { Electronic } from '../base';
import { LinePath } from './path';
import { LineData, LinePin, LinePinStatus } from './types';
import { Connect, ElectronicKind } from '../types';
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
    // const line = findLineComponent(id);

    // /** 交错节点 */
    // let crossIndex: 0 | 1;

    // // 连接导线的路径
    // if (this.way[0].isEqual(line.way[0])) {
    //     line.reverse();
    //     crossIndex = 0;
    // }
    // else if (this.way[0].isEqual(line.way.get(-1))) {
    //     crossIndex = 0;
    // }
    // else if (this.way.get(-1).isEqual(line.way.get(-1))) {
    //     line.reverse();
    //     crossIndex = 1;
    // }
    // else {
    //     crossIndex = 1;
    // }

    // line.replaceConnect(crossIndex, this.id);
    // this.connect[crossIndex] = line.connect[crossIndex];

    // this.way = LineWay.prototype.checkWayRepeat.call(
    //     crossIndex === 0
    //         ? line.way.concat(this.way)
    //         : this.way.concat(line.way),
    // );

    // // 更新及删除
    // this.dispatch();
    // this.deleteSelf();
  }

  /** 合并导线 */
  concat(id: string) {
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

  /** 设置标志位 */
  setMark() {
    const { path, map } = this;

    let last: MarkMapNode | undefined;
    let current: MarkMapNode | undefined;

    for (const point of path.forEachPoint()) {
      current = map.get(point);

      const index = this.points.findIndex((item) => item.position.isEqual(point));

      // 为空
      if (!current) {
        current = map.set({
          position: point,
          id: this.id,
          mark: index,
        });
      }
      // 导线点
      else if (current.isLine) {
        current.addLabel(this.id, index);
      }
      // 器件引脚不处理，其他类型全部抛出错误
      else if (current.kind !== MarkNodeKind.PartPin) {
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
        last.addConnect(current.position);
        current.addConnect(last.position);
      }

      last = current;
    }
  }

  /** 删除标记 */
  deleteMark() {
    // ..
  }

  /**
   * 由路径信息设置导线两端连接
   * @param {boolean} [concat=true] 是否合并浮动导线
   */
  setConnectByWay(concat?: boolean): void;
  /**
  * 由路径信息设置导线端点连接
  * @param {LinePin} [index] 需要设定的端点
  * @param {boolean} [concat=true] 是否合并浮动导线
  */
  setConnectByWay(pin?: LinePin, concat?: boolean): void;
  setConnectByWay(pin?: LinePin | boolean, concat = true) {
    if (isBoolean(pin)) {
      this.setConnectByWay(LinePin.Start, pin);
      this.setConnectByWay(LinePin.End, pin);
      return;
    }
    else if (isUndef(pin)) {
      this.setConnectByWay(0);
      this.setConnectByWay(1);
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
      const label = status.label;
      const part = this.find<Part>(label.id)!;
      const mark = label.mark!;

      status.addLabel(this.id, index);

      part.setConnection(mark, {
        id: this.id,
        mark: index,
      });

      this.setConnection(index, {
        id: part.id,
        mark: mark,
      });
    }
    // 端点在导线上
    else if (status.kind === MarkNodeKind.Line) {
      if (this.hasConnection(status.label.id)) {
        /**
         * 因为`setConnectByWay`函数运行之后可能还有后续动作
         * 所以这里需要等待一个更新周期
         */
        delay().then(() => this.delete());
      }
      else {
        this.split(status.label.id, pin);
      }
    }
    // // 端点为导线空引脚
    // else if (status.kind === MarkNodeKind.LinePoint) {
    //   // 允许合并
    //   if (concat) {
    //     debugger;
    //     this.concat(status.label);
    //   }
    //   // 不允许合并，则该点变更为交错节点
    //   else {
    //     const line = this.find<Line>(status.label)!;
    //     const mark = line.findConnectIndex(node);

    //     status.type = Map.NodeType.LineCrossPoint;
    //     status.id = mergeMark(this.id, line.id);
    //     Map.mergePoint(status);

    //     line.connect[mark] = this.id;
    //     this.connect[index] = line.id;

    //     line.update();
    //     this.update();
    //   }
    // }
    // // 端点在交错节点
    // else if (status.kind === MarkNodeKind.LineCrossPoint) {
    //   const lines = deleteMark(status.label, this.id);

    //   // 只有一个导线
    //   if (lines.length === 1 && concat) {
    //     this.concat(lines[0]);
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
    this.path.reverse();
    this.connections.reverse();
  }

  /** 输出数据 */
  toData(): Required<LineData> {
    return {
      kind: 'Line',
      path: this.path.toData(),
    };
  }
}
