import React from 'react';

import { PointLike } from '@circuit/math';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { DrawController } from 'src/lib/mouse';
import { cursorStyles } from 'src/styles';
import { ElectronicPoint } from './point';
import { PartComponent } from './part';
import { RectSize, PointKind, PointStatus, rectWidth } from './constant';
import { Line, draw } from '@circuit/electronics';

export class LineComponent extends Line {
  constructor(paths: PointLike[] = []) {
    super(paths);
    this.updateRects();
  }

  private _rects: RectSize[] = [];

  /** 接触面积方块 */
  get rects() {
    return this._rects;
  }

  /** 更新页面 */
  private update: () => void = () => void 0;
  /** 初始化 hook */
  private useInit() {
    this.update = useForceUpdate();
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

  /** 绘制导线 */
  async drawing(isEnd = true) {
    if (isEnd) {
      this.reverse();
    }

    this.deleteMark();
    this._rects = [];
    draw.init();

    const start = this.path[0];
    const connect = this.connects[0];

    if (!connect) {
      throw new Error(`空连接导线`);
    }

    const startPart = this.find<PartComponent>(connect.id);
    const direction = startPart?.points[connect.mark]?.direction;

    if (!startPart || !direction) {
      throw new Error(`不存在的器件：${connect.id}`);
    }

    await new DrawController()
      .setClassName(cursorStyles.drawLine)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((ev) => {
        this.path = draw.search(start, direction, ev, this);
        this.update();
      })
      .start();

    debugger;
  }

  /** 渲染函数 */
  Render = () => {
    this.useInit();

    const { path, rects, points } = this;

    return (
      <g>
        <path d={path.stringify()} />
        {rects.map((rect, i) => <rect key={i} {...rect} />)}
        {points.map((point) => (
          <ElectronicPoint
            key={point.index}
            size={point.size}
            kind={PointKind.Line}
            status={point.isConnected ? PointStatus.Close : PointStatus.Open}
            transform={`translate(${point.position.join()})`}
          />
        ))}
      </g>
    );
  }
}
