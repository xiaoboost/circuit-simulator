import React from 'react';
import styles from './styles.styl';

import { Electronic } from './base';
import { isNumber } from '@utils/assert';
import { DeepReadonly } from '@utils/types';
import { SignNodeKind } from 'src/lib/map';
import { DrawController } from 'src/lib/mouse';
import { ElectronicPrototype, Electronics } from './parts';
import { Matrix, Point, PointInput, Directions } from 'src/math';
import { useForceUpdate } from 'src/use';
import { ElectronicPoint } from './point';

import {
  ElectronicKind,
  PartData,
  PartPinStatus,
  PointKind,
  PointStatus,
} from './constant';

export class Part extends Electronic implements PartData {
  /** 旋转坐标 */
  rotate: Matrix;
  /** 位置坐标 */
  position: Point;
  /** 参数描述 */
  params: string[];
  /** 文本位置 */
  textPosition = new Point(0, 0);

  /** 更新页面 */
  update?: () => void;
  /** 引脚状态 */
  pointStatus: PartPinStatus[] = [];
  /** 参数文本 */
  texts: string[] = [];
  /** 旋转逆矩阵 */
  invRotate = new Matrix(2, 'E');

  constructor(kind: ElectronicKind | Partial<PartData>) {
    super(isNumber(kind) ? kind : kind.kind!);

    const { prototype } = this;
    const data: Partial<PartData> = !isNumber(kind) ? kind : {
      kind,
    };

    this.params = data.params ?? prototype.params.map((n) => n.default);
    this.rotate = data.rotate ? Matrix.from(data.rotate) : new Matrix(2, 'E');
    this.position = data.position ? Point.from(data.position) : new Point(1e6, 1e6);

    this.updatePoints();
    this.updateTexts();
    this.updateInvRotate();
  }

  /** 器件原型数据 */
  get prototype(): DeepReadonly<ElectronicPrototype> {
    return Electronics[this.kind];
  }

  /** 标志 */
  get label() {
    const label = this.id.split('_');
    return {
      id: this.id,
      label: label[0],
      sub: label[1],
    };
  }

  /** 是否显示文本 */
  get showText() {
    return this.kind !== ElectronicKind.ReferenceGround;
  }

  /** 初始化 hook */
  useInit() {
    this.update = useForceUpdate();
  }

  /** 更新引脚状态 */
  updatePoints() {
    const points = Array.from(this.points());

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const current = this.pointStatus[i];

      this.pointStatus[i] = point;

      if (current?.size) {
        this.pointStatus[i].size = current.size;
      }

      if (current?.className) {
        this.pointStatus[i].className = current.className;
      }
    }
  }

  /** 更新参数文本 */
  updateTexts() {
    this.texts = this.params
      .map((v, i) => ({ ...Electronics[this.kind].params[i], value: v }))
      .filter((txt) => txt.vision)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'));
  }

  /** 更新逆矩阵 */
  updateInvRotate() {
    this.invRotate = this.rotate.inverse();
  }

  /** 迭代器件当前覆盖的所有节点 */
  *padding() {
    const { prototype, position, rotate } = this;
    const boxSize = prototype.padding;
    const endpoint = [[-boxSize[3], -boxSize[0]], [boxSize[1], boxSize[2]]];
    const data = endpoint.map((point) => Point.prototype.rotate.call(point, rotate));
    const padding = [
      [
        Math.min(data[0][0], data[1][0]),
        Math.min(data[0][1], data[1][1]),
      ],
      [
        Math.max(data[0][0], data[1][0]),
        Math.max(data[0][1], data[1][1]),
      ],
    ];

    for (let x = position[0] + padding[0][0]; x <= position[0] + padding[1][0]; x++) {
      for (let y = position[1] + padding[0][1]; y <= position[1] + padding[1][1]; y++) {
        yield new Point(x, y);
      }
    }
  }

  /** 迭代器件当前所有引脚节点 */
  *points() {
    const { prototype, rotate } = this;

    for (let i = 0; i < prototype.points.length; i++) {
      const point = prototype.points[i];
      yield {
        label: `${this.id}_${i}`,
        origin: Point.from(point.position as PointInput),
        position: Point.prototype.rotate.call(point.position, rotate),
        direction: Point.prototype.rotate.call(Directions[point.direction], rotate),
      };
    }
  }

  /** 设置标志位 */
  setSign() {
    for (const point of this.padding()) {
      this.map.set({
        label: this.id,
        point: point,
        kind: SignNodeKind.Part,
      });
    }

    for (const point of this.points()) {
      this.map.set({
        label: this.id,
        point: point.position.add(this.position),
        kind: SignNodeKind.PartPoint,
      });
    }
  }

  /** 删除标记 */
  deleteSign() {
    for (const point of this.padding()) {
      this.map.delete(point);
    }

    for (const point of this.points()) {
      this.map.delete(point.position.add(this.position));
    }
  }

  /** 是否被占用 */
  isOccupied(location = this.position) {
    return false;
  }

  /** 创建器件 */
  create() {
    // 选中自己
    this.setSelects([this.id]);

    new DrawController()
      // .setCursor('move_part')
      .setStopEvent({ type: 'mousedown', which: 'Left' })
      .setMoveEvent((e) => {
        this.position = e.position;
        this.update?.();
      })
      .start()
      .then(() => {
        const node = this.position;

        this.position = Point.from(
          node.round(20)
            .around((point) => !this.isOccupied(point), 20)
            .reduce(
              (pre, next) =>
                node.distance(pre) < node.distance(next) ? pre : next,
            ),
        );

        this.setSign();
        this.update?.();
      });
  }

  /** 渲染函数 */
  Render = () => {
    this.useInit();

    const {
      prototype,
      rotate,
      position,
      invRotate,
      label,
      showText,
      texts,
      pointStatus,
      textPosition,
    } = this;

    return (
      <g transform={`matrix(${rotate.join()},${position.join()})`}>
        <g className="part-focus">
          <g>
            {prototype.shape.map((item, i) => (
              React.createElement(item.name, {
                ...item.attribute,
                key: i,
              })
            ))}
          </g>
          {pointStatus.map((point) => (
            <ElectronicPoint
              key={point.label}
              size={point.size}
              kind={PointKind.Part}
              status={PointStatus.Open}
              transform={`translate(${point.origin.join()})`}
            />
          ))}
        </g>
        {showText && (
          <g
            className={styles.partText}
            transform={`matrix(${invRotate.join()},${textPosition.rotate(invRotate).join()})`}
          >
            <text>
              <tspan>{label.label}</tspan>
              <tspan fontSize="70%">{label.sub}</tspan>
            </text>
            {texts.map((text, i) => (
              <text key={i} dy={16 * (i + 1)}>{text}</text>
            ))}
          </g>
        )}
      </g>
    );
  }
}
