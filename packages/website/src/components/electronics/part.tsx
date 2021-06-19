import React from 'react';

import { partStyles } from './styles';
import { cursorStyles } from 'src/styles';
import { editPartParams } from '../params-dialog';
import { mapState } from '../drawing-sheet/map';
import { Point, Direction, Directions } from '@circuit/math';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { MouseButtons } from '@xiao-ai/utils/web';
import { stringifyClass } from '@xiao-ai/utils';
import { ElectronicPoint } from './point';
import { LineComponent } from './line';
import { parts } from 'src/store';
import { DrawEventController } from '@circuit/event';
import { ElectronicKind, Part, PartData } from '@circuit/electronics';
import { PointKind, PointStatus, textHeight, textSpaceHeight } from './constant';

export class PartComponent extends Part {
  /** 文本位置 */
  textPosition = new Point(0, 0);

  constructor(kind: ElectronicKind | PartData) {
    super(kind);
    this.textPosition = Directions[this.textPlacement].mul(100);
    this.updateTextPosition();
    parts.setData(parts.data.concat(this));
  }

  /** 初始化 hook */
  private useInit() {
    this.updateView = useForceUpdate();
  }

  /** 更新文本位置 */
  private updateTextPosition() {
    const {
      texts,
      points,
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

  /** 删除自己 */
  delete() {
    super.delete();
    parts.setData(parts.data.filter((item) => item !== this));
  }

  /** 创建器件 */
  create() {
    // 选中自己
    this.setSelects([this.id]);

    new DrawEventController()
      // .setCursor('move_part')
      .setStopEvent({ type: 'click', which: 'Left' })
      .setMoveEvent((e) => {
        this.position = e.position;
        this.updateView();
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

        this.setMark();
        this.updateView();
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

    new DrawEventController()
      .setClassName(cursorStyles.movePart)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((e) => {
        this.textPosition = this.textPosition.add(e.movement);
        this.updateView();
      })
      .start()
      .then(() => {
        this.updateTextPosition();
        this.updateView();
      });
  }

  /** 开始绘制 */
  startDraw(ev: React.MouseEvent, i: number) {
    if (ev.button !== MouseButtons.Left) {
      return;
    }

    ev.stopPropagation();

    let line: LineComponent;

    const startPoint = this.position.add(this.points[i].position);
    const connect = this.connections[i];

    // 该引脚已有连接
    if (connect.value) {
      const { id: lineId, mark } = connect.value;

      line = this.find<LineComponent>(lineId)!;

      if (mark === 0) {
        line.reverse();
      }

      this.connections[i].clear();
      line.connections[mark].clear();
      this.setSelects([line.id]);
    }
    // 该引脚为空
    else {
      line = new LineComponent([startPoint]);
      this.setConnection(i, { id: line.id, mark: 0 });
      line.setConnection(0, { id: this.id, mark: i });
      this.setSelects([this.id]);
    }

    this.updateView();
    line.drawing();
  }

  /** 渲染函数 */
  Render = () => {
    this.useInit();

    const {
      id,
      prototype,
      rotate,
      position,
      invRotate,
      texts,
      points,
      textPosition,
      textPlacement,
    } = this;

    const [label, subId] = id.split('_');
    const showText = this.kind !== ElectronicKind.ReferenceGround;
    const moveText = React.useCallback(this.moveText.bind(this), []);
    const editParam = React.useCallback(this.editParams.bind(this), []);

    return (
      <g
        data-id={id}
        className={partStyles.part}
        onDoubleClick={editParam}
        transform={`matrix(${rotate.join()},${position.join()})`}
      >
        <g className={partStyles.partFocus}>
          {prototype.shape.map((item, i) => (
            React.createElement(item.name, {
              ...item.attribute,
              key: i,
            })
          ))}
          {points.map((point, i) => (
            <ElectronicPoint
              key={point.index}
              size={point.size}
              kind={PointKind.Part}
              position={point.origin}
              status={point.isConnected ? PointStatus.Close : PointStatus.Open}
              onMouseDown={(ev) => this.startDraw(ev, i)}
            />
          ))}
        </g>
        {showText && (
          <g
            fontSize={`${textHeight}px`}
            className={stringifyClass(
              partStyles.partText,
              partStyles[Direction[textPlacement]],
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
