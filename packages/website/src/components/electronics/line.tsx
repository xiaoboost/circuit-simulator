import React from 'react';

import { PointLike } from '@circuit/math';
import { useForceUpdate, useWatcher } from '@xiao-ai/utils/use';
import { cursorStyles } from 'src/styles';
import { ElectronicPoint } from './point';
import { PartComponent } from './part';
import { lineStyles, partStyles } from './styles';
import { MarkNodeKind } from '@circuit/map';
import { DrawEventController } from '@circuit/event';
import { Sheet, Selection } from 'src/store';
import { ConstructorParameters, stringifyClass } from '@xiao-ai/utils';
import { Line, DrawPathSearcher, LinePin, MouseFocusClassName } from '@circuit/electronics';
import { RectSize, PointKind, rectWidth } from './constant';

export class LineComponent extends Line {
  constructor(paths: PointLike[] = []) {
    super(paths);
    this.updateRects();
    Sheet.lines.setData(Sheet.lines.data.concat(this));
  }

  private _rects: RectSize[] = [];

  /** 接触面积方块 */
  get rects() {
    return this._rects;
  }

  /** 创建新导线 */
  create(...args: ConstructorParameters<typeof LineComponent>) {
    return new LineComponent(...args);
  }

  /** 更新所有导线 */
  updateListView() {
    Sheet.lines.setData(Sheet.lines.data.slice());
  }

  /** 初始化 hook */
  private useInit() {
    this.updateView = useForceUpdate();
  }
  /** 更新接触方块 */
  private updateRects() {
    this._rects = [];

    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i], end = this.path[i + 1];
      const left = Math.min(start[0], end[0]);
      const top = Math.min(start[1], end[1]);
      const right = Math.max(start[0], end[0]);
      const bottom = Math.max(start[1], end[1]);

      this._rects.push({
        x: left - rectWidth / 2,
        y: top - rectWidth / 2,
        height: (left === right) ? bottom - top + rectWidth : rectWidth,
        width: (left === right) ? rectWidth : right - left + rectWidth,
      });
    }
  }

  /** 删除自己 */
  delete() {
    super.delete();
    Sheet.lines.setData(Sheet.lines.data.filter((item) => item !== this));
  }

  /** 绘制导线 */
  async drawing(pin: LinePin.Start | LinePin.End = LinePin.End) {
    if (pin === LinePin.Start) {
      this.reverse();
    }

    this.deleteMark();
    this.updatePoints();
    this.updateView();
    this._rects = [];

    const start = this.path[0];
    const connect = this.connections[0];

    if (!connect.value) {
      throw new Error(`空连接导线`);
    }

    const startPart = this.find<PartComponent>(connect.value.id);
    const direction = startPart?.points[connect.value.mark]?.direction;

    if (!startPart || !direction) {
      throw new Error(`不存在的器件：${connect.value.id}`);
    }

    const pathSearcher = new DrawPathSearcher(start, direction, this);
    const drawEvent = new DrawEventController();
    const overSelector = [
      `.${partStyles.part} .${partStyles.partFocus}`,
      `.${lineStyles.line} .${lineStyles.lineFocus}`,
    ].join(', ');

    this.sortIndex = 0;
    this.updateListView();

    await drawEvent
      .setClassName(cursorStyles.drawLine)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((ev) => {
        this.path = pathSearcher.search(ev.position, ev.movement);
      })
      .setEvent({
        type: 'mouseenter',
        selector: overSelector,
        callback: (ev) => {
          const element = ev.target.parentElement!;
          const currentId = element.dataset.id as string;

          if (currentId && currentId !== this.id) {
            const el = this.find<LineComponent | PartComponent>(currentId);

            if (el) {
              pathSearcher.setMouseOver(el);
            }
          }
        },
      })
      .setEvent({
        type: 'mouseleave',
        selector: overSelector,
        callback: (ev) => {
          const element = ev.target.parentElement!;
          const currentId = element.dataset.id as string;

          if (currentId && currentId !== this.id) {
            pathSearcher.freeMouse();
          }
        },
      })
      .start();

    /** 格式化终点坐标 */
    let finalEnd = this.path.get(-1).round();
    /** 终点信息 */
    const endData = this.map.get(finalEnd);
    /** 终点坐标 */
    const endNode = this.path.get(-1);

    // 起点和终点相等或者只有一个点，则删除当前导线
    if (this.path.length < 2 || finalEnd.isEqual(this.path[0])) {
      this.delete();
      return;
    }

    // 终点被占用
    if (endData && endData.kind === MarkNodeKind.Part) {
      finalEnd = (
        finalEnd
          .around((node) => !this.map.has(node))
          .reduce((pre, next) =>
            endNode.distance(pre) < endNode.distance(next) ? pre : next,
          )
      );
    }

    this.sortIndex = undefined;
    this.points[1].size = -1;
    this.path.endToPoint(finalEnd);

    this.setConnectionByPath(LinePin.End);
    this.setMark();
    this.updateRects();
    this.updateListView();
  }

  /** 渲染函数 */
  Render = () => {
    this.useInit();

    const { path, rects, points, id } = this;
    const [selection] = useWatcher(Selection.data);

    return (
      <g
        data-id={id}
        className={stringifyClass(lineStyles.line, {
          [lineStyles.lineSelected]: Boolean(selection[id]),
        })}
      >
        <path d={path.stringify()} />
        <g className={lineStyles.lineFocus}>
          {rects.map((rect, i) => (
            <rect key={i} className={MouseFocusClassName} {...rect} />
          ))}
          {points.map((point) => (
            <ElectronicPoint
              key={point.index}
              size={point.size}
              kind={PointKind.Line}
              position={point.position}
              status={point.status}
            />
          ))}
        </g>
      </g>
    );
  }
}
