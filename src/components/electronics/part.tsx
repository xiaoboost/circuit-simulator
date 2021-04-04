import React from 'react';
import styles from './styles.styl';

import { Electronic } from './base';
import { isNumber } from '@utils/assert';
import { DeepReadonly } from '@utils/types';
import { MouseButtons } from '@utils/event';
import { stringifyClass } from '@utils/string';
import { SignNodeKind } from 'src/lib/map';
import { DrawController } from 'src/lib/mouse';
import { ElectronicPrototype, Electronics } from './parts';
import { Matrix, Point, PointInput, Direction, Directions } from 'src/math';
import { useForceUpdate } from 'src/use';
import { ElectronicPoint } from './point';
import { Line } from './line';

import {
  ElectronicKind,
  PartData,
  PartPinStatus,
  PointKind,
  PointStatus,
} from './constant';

export class Part extends Electronic implements PartData {
  /** 旋转坐标 */
  _rotate: Matrix;
  /** 位置坐标 */
  position: Point;
  /** 参数描述 */
  params: string[];
  /** 参数文本 */
  texts: string[] = [];
  /** 文本位置 */
  textPosition = new Point(0, 0);
  /** 说明文本方向 */
  textPlacement = Direction.Bottom;
  /** 引脚状态 */
  points: PartPinStatus[] = [];
  /** 旋转逆矩阵 */
  _invRotate = new Matrix(2, 'E');
  /** 器件边距 */
  margin = {
    margin: [0, 0, 0, 0] as const,
    padding: [0, 0, 0, 0] as const,
  };

  /** 文本高度 */
  readonly textHeight = 14;
  /** 文本间隔高度 */
  readonly textSpaceHeight = 5;

  /** 更新页面 */
  private _update?: () => void;

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
    this.updateRotate();
  }

  /** 器件原型数据 */
  get prototype(): DeepReadonly<ElectronicPrototype> {
    return Electronics[this.kind];
  }

  /** 旋转坐标 */
  get rotate() {
    return this._rotate;
  }

  set rotate(ma: Matrix) {
    this._rotate = ma;
    this._invRotate = ma.inverse();
  }

  /** 初始化 hook */
  private useInit() {
    this._update = useForceUpdate();
  }

  /** 更新引脚状态 */
  private updatePoints() {
    const { prototype, rotate } = this;

    for (let i = 0; i < prototype.points.length; i++) {
      const point = prototype.points[i];
      const current = this.points[i];

      this.points[i] = {
        label: `${this.id}_${i}`,
        isConnected: Boolean(this.connects[i]),
        origin: Point.from(point.position as PointInput),
        position: Point.prototype.rotate.call(point.position, rotate),
        direction: Point.prototype.rotate.call(Directions[point.direction], rotate),
      };

      if (current?.size) {
        this.points[i].size = current.size;
      }

      if (current?.className) {
        this.points[i].className = current.className;
      }
    }
  }

  /** 更新参数文本 */
  private updateTexts() {
    this.texts = this.params
      .map((v, i) => ({ ...Electronics[this.kind].params[i], value: v }))
      .filter((txt) => txt.vision)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'));
  }

  /** 获取器件当前内外边界 */
  private getMargin() {
    const { prototype, rotate } = this;
    /** 方向下标顺序 */
    const directionIndex = {
      [Direction.Top]: 0,
      [Direction.Right]: 1,
      [Direction.Bottom]: 2,
      [Direction.Left]: 3,
    };
    /** 盒子四个数值的顺序 */
    const marginDirections = (
      [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left]
        .map((item) => Directions[item])
    );

    debugger;
    for (const key of ['margin', 'padding'] as const) {
      prototype[key]
        .map((item, i) => marginDirections[i].rotate(rotate).mul(item * 20))
        .forEach((point) => {
          const index = directionIndex[point.toDirection()];
          const len = point.product([1, 1]);
          (this.margin[key] as any)[index] = len;
        });
    }
  }

  /** 更新矩阵 */
  private updateRotate() {
    this.invRotate = this.rotate.inverse();
    this.getMargin();
  }

  /** 更新文本位置 */
  private updateTextPosition() {
    this.updateTexts();

    const {
      texts,
      points,
      margin,
      textPosition: tPosition,
    } = this;

    debugger;
    this.textPlacement = [Direction.Top, Direction.Bottom, Direction.Left, Direction.Right]
      .map((item) => Directions[item])
      .filter((di) => points.every((point) => !point.direction.isEqual(di)))
      .reduce(
        (pre, next) =>
          pre.distance(tPosition) < next.distance(tPosition) ? pre : next,
      )
      .toDirection();

    switch (this.textPlacement) {
      case Direction.Top: {
        break;
      }
      case Direction.Bottom: {
        break;
      }
      case Direction.Left: {
        break;
      }
      case Direction.Right: {
        break;
      }
      default: {
        throw new Error(`错误的器件方向: ${Direction[this.textPlacement]}`);
      }
    }
  }

  /** 更新页面 */
  update() {
    this._update?.();
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

  /** 设置标志位 */
  setSign() {
    for (const point of this.padding()) {
      this.map.set({
        label: this.id,
        point: point,
        kind: SignNodeKind.Part,
      });
    }

    for (const point of this.points) {
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

    for (const point of this.points) {
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

  /** 开始绘制 */
  startDraw(ev: React.MouseEvent, i: number) {
    if (ev.button !== MouseButtons.Left) {
      return;
    }

    let line: Line;

    debugger;
    const startPoint = this.position.add(this.points[i].position);
    const connect = this.connects[i];

    // 该引脚已有连接
    if (connect) {
      const { id: lineId, mark } = connect;

      line = this.findLine(lineId)!;

      if (mark === 0) {
          line.reverse();
      }

      this.connects[i] = undefined;
      line.connects[mark] = undefined;
      this.setSelects([line.id]);
    }
    // 该引脚为空
    else {
      line = new Line([startPoint]);
      this.connects[i] = { id: line.id, mark: 0 };
      line.connects[0] = { id: this.id, mark: i };
      this.setSelects([this.id]);
    }

    debugger;
    line.toBottom();
    line.drawing();
  }

  /** 渲染函数 */
  Render = () => {
    this.useInit();

    const {
      prototype,
      rotate,
      position,
      invRotate,
      texts,
      points,
      textPosition,
      textHeight,
      textPlacement,
      textSpaceHeight,
    } = this;

    const showText = this.kind !== ElectronicKind.ReferenceGround;
    const [label, subId] = this.id.split('_')[0];

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
          {points.map((point, i) => (
            <ElectronicPoint
              key={point.label}
              size={point.size}
              kind={PointKind.Part}
              status={point.isConnected ? PointStatus.Close : PointStatus.Open}
              transform={`translate(${point.origin.join()})`}
              onMouseDown={(ev) => this.startDraw(ev, i)}
            />
          ))}
        </g>
        {showText && (
          <g
            fontSize={`${textHeight}px`}
            className={stringifyClass(
              styles.partText,
              styles[`placement${Direction[textPlacement]}`],
            )}
            transform={`matrix(${invRotate.join()},${textPosition.rotate(invRotate).join()})`}
          >
            <text>
              <tspan>{label}</tspan>
              <tspan fontSize="70%">{subId}</tspan>
            </text>
            {texts.map((text, i) => (
              <text key={i} dy={(textHeight + textSpaceHeight) * (i + 1)}>{text}</text>
            ))}
          </g>
        )}
      </g>
    );
  }
}
