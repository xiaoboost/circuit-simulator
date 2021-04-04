import React from 'react';

import { Electronic } from './base';
import { LineWay } from './line-way';
import { PointLike } from 'src/math';
import { useForceUpdate } from 'src/use';
import { ElectronicKind, LineData, RectSize } from './constant';

export class Line extends Electronic implements LineData {
  /** 路径数据 */
  path: LineWay;
  /** 绘制状态 */
  isDrawStatus = false;
  /** 接触面积方块 */
  rects: RectSize[] = [];

  /** 更新页面 */
  private _update?: () => void;

  constructor(paths: PointLike[] = []) {
    super(ElectronicKind.Line);
    this.path = LineWay.from(paths);
  }

  /** 初始化 hook */
  private useInit() {
    this._update = useForceUpdate();
  }

  /** 更新接触方块 */
  private updateRect() {
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
  
  /** 更新组件 */
  update() {
    this._update?.();
  }

  /** 设置标志位 */
  setSign() {

  }

  /** 删除标记 */
  deleteSign() {

  }

  /** 导线反转 */
  reverse() {
    this.path.reverse();
    this.connects.reverse();
  }

  /** 绘制导线 */
  drawing(isEnd = true) {
    if (isEnd) {
      this.reverse();
    }

    this.deleteSign();
  }

  /** 渲染函数 */
  Render = () => {
    this.useInit();

    const { path, rects } = this;

    return (
      <g>
        <path path={path.stringify()} />
        {rects.map((rect, i) => (
          <rect key={i} {...rect} />
        ))}
      </g>
    );
  }
}
