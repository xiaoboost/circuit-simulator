import React from 'react';

import { part as partStyles } from './styles';
import { Electronic } from './base';
import { SignNodeKind } from 'src/lib/map';
import { cursorStyles } from 'src/lib/styles';
import { PartData } from './constant';
import { DrawController } from 'src/lib/mouse';
import { editPartParams } from '../params-dialog';
import { mapState } from '../drawing-sheet/map';
import { ElectronicPrototype, Electronics, MarginDirection } from './parts';
import { Matrix, Point, PointInput, Direction, Directions } from '@circuit/math';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { MouseButtons } from '@xiao-ai/utils/web';
import { isNumber, stringifyClass } from '@xiao-ai/utils';
import { ElectronicPoint } from './point';
import { Line } from './line';

import {
  ElectronicKind,
  PartPinStatus,
  PointKind,
  PointStatus,
} from './constant';

export class Part extends Electronic {
  /** 旋转坐标 */
  rotate: Matrix;
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
  invRotate = new Matrix(2, 'E');
  /** 器件边距 */
  margin = {
    margin: [0, 0, 0, 0] as const,
    padding: [0, 0, 0, 0] as const,
  };

  visible = false;

  /** 文本高度 */
  readonly textHeight = 14;
  /** 文本高度间隔 */
  readonly textSpaceHeight = 2;

  /** 更新页面 */
  private _update?: () => void;

  constructor(kind: ElectronicKind | PartData) {
    super(kind);

    const { prototype } = this;
    const data: Partial<Omit<PartData, 'kind'>> = !isNumber(kind) ? kind : {};

    this.params = data.params ?? prototype.params.map((n) => n.default);
    this.rotate = data.rotate ? Matrix.from(data.rotate) : new Matrix(2, 'E');
    this.position = data.position ? Point.from(data.position) : new Point(1e6, 1e6);
    this.textPlacement = data.text ? Direction[data.text] : Direction.Bottom;
    this.textPosition = Directions[this.textPlacement].mul(100);

    this.updatePoints();
    this.updateRotate();
    this.updateMargin();
    this.updateTextPosition();
  }

  /** 器件原型数据 */
  get prototype(): ElectronicPrototype {
    return Electronics[this.kind];
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
  private updateMargin() {
    const { prototype, rotate } = this;

    [Direction.Top, Direction.Right, Direction.Bottom, Direction.Left]
      .map((item) => Directions[item].rotate(rotate))
      .forEach((vector, i) => {
        const index = MarginDirection[vector.toDirection()];
        const paddingLen = Math.abs(vector.product([1, 1])) * 20 * prototype.padding[i];
        const marginLen = Math.abs(vector.product([1, 1])) * 20 * prototype.margin[i];
        (this.margin.margin as any)[index] = marginLen;
        (this.margin.padding as any)[index] = paddingLen;
      });
  }

  /** 更新矩阵 */
  private updateRotate() {
    this.invRotate = this.rotate.inverse();
    this.updateMargin();
  }

  /** 更新文本位置 */
  private updateTextPosition() {
    this.updateTexts();

    const {
      texts,
      points,
      margin,
      textHeight,
      textSpaceHeight,
      prototype,
      textPosition: position,
    } = this;

    this.textPlacement = [
      Direction.Top,
      Direction.Bottom,
      Direction.Left,
      Direction.Right,
    ]
      .map((item) => Directions[item])
      .filter((di) => points.every((point) => !point.direction.isEqual(di)))
      .reduce(
        (pre, next) =>
          pre.distance(position) < next.distance(position) ? pre : next,
      )
      .toDirection();

    const len = texts.length + 1;
    const bias = prototype.txtLBias;

    switch (this.textPlacement) {
      case Direction.Top: {
        position[0] = 0;
        position[1] = -((textHeight + textSpaceHeight) * (len - 1) + bias);
        break;
      }
      case Direction.Bottom: {
        position[0] = 0;
        position[1] = textHeight + bias;
        break;
      }
      case Direction.Left: {
        position[0] = -bias;
        position[1] = textHeight - (len * textHeight + (len - 1) * textSpaceHeight) / 2;
        break;
      }
      case Direction.Right: {
        position[0] = bias;
        position[1] = textHeight - (len * textHeight + (len - 1) * textSpaceHeight) / 2;
        break;
      }
      default: {
        throw new Error(`错误的器件方向: ${Direction[this.textPlacement]}`);
      }
    }

    // 整体向上偏移 2 像素
    position[1] -= 2;
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
      .setStopEvent({ type: 'click', which: 'Left' })
      .setMoveEvent((e) => {
        this.position = e.position;
        this.update();
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
        this.update();
      });
  }

  /** 编辑参数 */
  editParams() {
    editPartParams({
      id: this.id,
      params: this.params,
      prototype: this.prototype,
      position: this.position
        .mul(mapState.data.zoom)
        .add(mapState.data.position),
    });
  }

  /** 移动文本 */
  moveText(ev: React.MouseEvent) {
    if (ev.button !== MouseButtons.Left) {
      return;
    }

    ev.stopPropagation();
    this.setSelects([this.id]);

    new DrawController()
      .setClassName(cursorStyles.movePart)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((e) => {
        this.textPosition = this.textPosition.add(e.movement);
        this.update();
      })
      .start()
      .then(() => {
        this.updateTextPosition();
        this.update();
      });
  }

  /** 开始绘制 */
  startDraw(ev: React.MouseEvent, i: number) {
    if (ev.button !== MouseButtons.Left) {
      return;
    }

    ev.stopPropagation();

    let line: Line;

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
      this.dispatch();
    }
    
    this.updatePoints();
    this.update();

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

    const [label, subId] = this.id.split('_');
    const classNames = partStyles();
    const showText = this.kind !== ElectronicKind.ReferenceGround;
    const moveText = React.useCallback(this.moveText.bind(this), []);
    const editParam = React.useCallback(this.editParams.bind(this), []);

    return (
      <g
        className={classNames.part}
        onDoubleClick={editParam}
        transform={`matrix(${rotate.join()},${position.join()})`}
      >
        <g className="part-focus">
          {prototype.shape.map((item, i) => (
            React.createElement(item.name, {
              ...item.attribute,
              key: i,
            })
          ))}
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
              classNames.partText,
              classNames[Direction[textPlacement]],
            )}
            transform={`matrix(${invRotate.join()},${textPosition.rotate(invRotate).join()})`}
            onMouseDown={moveText}
          >
            <text>
              <tspan>{label}</tspan>
              <tspan fontSize="60%">{subId}</tspan>
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
