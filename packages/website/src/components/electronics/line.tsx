import React from 'react';

import { Electronic } from './base';
import { LineWay } from './line-way';
import { PointLike } from '@circuit/math';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { DrawController } from 'src/lib/mouse';
import { cursorStyles } from 'src/lib/styles';
import { ElectronicPoint } from './point';

import { draw } from './line-way';

import {
  ElectronicKind,
  RectSize,
  LinePinStatus,
  PointKind,
  PointStatus,
  LineData,
} from './constant';

export class Line extends Electronic {
  /** 路径数据 */
  path: LineWay;
  /** 绘制状态 */
  isDrawStatus = false;
  /** 接触面积方块 */
  rects: RectSize[] = [];
  /** 导线引脚状态 */
  points: LinePinStatus[] = [];

  constructor(paths: PointLike[] = []) {
    super(ElectronicKind.Line);
    this.path = LineWay.from(paths);
    this.updateRects();
    this.updatePoints();
  }

  /** 更新页面 */
  private update: () => void = () => void 0;

  /** 初始化 hook */
  private useInit() {
    this.update = useForceUpdate();
  }

  /** 更新接触方块 */
  private updateRects() {
    if (this.isDrawStatus) {
      this.rects = [];
    }

    const ans = [], wide = 14;

    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i], end = this.path[i + 1];
      const left = Math.min(start[0], end[0]);
      const top = Math.min(start[1], end[1]);
      const right = Math.max(start[0], end[0]);
      const bottom = Math.max(start[1], end[1]);

      ans.push({
        x: left - wide / 2,
        y: top - wide / 2,
        height: (left === right) ? bottom - top + wide : wide,
        width: (left === right) ? wide : right - left + wide,
      });
    }

    this.rects = ans;
  }

  /** 更新节点 */
  private updatePoints() {
    if (this.path.length === 0) {
      this.points = [];
    }

    for (let i = 0; i < 2; i++) {
      const position = this.path[i * (this.path.length - 1)];
      const oldData = this.points[i];

      this.points[i] = {
        label: `${this.id}_${i}`,
        isConnected: Boolean(this.connects[i]),
        position,
      };
      
      if (oldData?.size) {
        this.points[i].size = oldData.size;
      }

      if (oldData?.className) {
        this.points[i].className = oldData.className;
      }
    }
  }

  /** 设置标志位 */
  setMark() {
    // ..
  }

  /** 删除标记 */
  deleteMark() {
    // ..
  }

  /** 导线反转 */
  reverse() {
    this.path.reverse();
    this.connects.reverse();
  }

  /** 输出数据 */
  toData(): Required<LineData> {
    return {
      kind: 'Line',
      path: this.path.toData(),
    };
  }

  /** 绘制导线 */
  async drawing(isEnd = true) {
    if (isEnd) {
      this.reverse();
    }

    this.deleteMark();
    this.rects = [];
    draw.init();

    const start = this.path[0];
    const connect = this.connects[0];

    if (!connect) {
      throw new Error(`空连接导线`);
    }

    const startPart = this.findPart(connect.id);
    const direction = startPart?.points[connect.mark]?.direction;

    if (!startPart || !direction) {
      throw new Error(`不存在的器件：${connect.id}`);
    }

    await new DrawController()
      .setClassName(cursorStyles.drawLine)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((ev) => {
        this.path = draw.search(start, direction, ev, this);
        this.updatePoints();
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
            key={point.label}
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
