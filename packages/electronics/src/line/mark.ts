import { MarkKind, LineAndPointMark } from '@circuit/map';
import { PointLike } from '@circuit/math';
import { SheetContext, Electronic } from '../base';
import { ElectronicKind } from '../types';
import { LinePath } from './path';

export class LineMarker extends Electronic {
  constructor(paths: PointLike[] = [], context?: SheetContext) {
    super(ElectronicKind.Line, context);
    this.path = LinePath.from(paths);
  }

  /** 导线路径 */
  protected path = new LinePath();

  /** 设置图纸数据 */
  setMark() {
    const { sheet: { markMap: map }, id: line, path: points } = this;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const lastPoint = points[i - 1];
      const mark = map.get(point);

      // 运行时距离检查
      if (process.env.NODE_ENV === 'development' && lastPoint) {
        if (Math.abs(lastPoint.add(point, -1).product([1, 1])) !== 20) {
          throw new Error('导线节点距离必须是 20');
        }
      }

      // 端点
      if (i === 0 || i === points.length - 1) {
        if (mark) {
          if (mark.isLinePoint()) {
            mark.toCrossMark(line);
          }
          else if (mark.isLineCross() && !mark.isFullCross) {
            mark.addLine(line);
          }
          else if (mark.isPartPin()) {
            mark.connectLine(line);
          }
          else {
            throw new Error('导线端点只能出现在其他导线端点、交错节点、器件引脚处');
          }
        }
        else {
          map.set(point, {
            kind: MarkKind.LinePoint,
            line,
          });
        }
      }
      else {
        if (mark) {
          if (mark.isLine()) {
            mark.addCoverLine(line);
          }
          else {
            throw new Error('导线非端点只能途经其余导线的非端点');
          }
        }
        else {
          map.set(point, {
            kind: MarkKind.Line,
            line,
          });
        }
      }

      if (!lastPoint) {
        continue;
      }

      const lastMark = map.get<LineAndPointMark>(lastPoint)!;
      const currentMark = map.get<LineAndPointMark>(point)!;

      lastMark.addConnect(currentMark.position, line);
      currentMark.addConnect(lastMark.position, line);
    }
  }

  /** 移除图纸数据 */
  deleteMark() {
    const { sheet: { markMap: map }, id: line, path: points } = this;

    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const lastPoint = points[i - 1];
      const mark = map.get(point);

      // 运行时距离检查
      if (process.env.NODE_ENV === 'development' && lastPoint) {
        if (Math.abs(lastPoint.add(point, -1).product([1, 1])) !== 20) {
          throw new Error('导线节点距离必须是 20');
        }

        if (
          mark &&
          (
            (('line' in mark) && mark.line !== line) ||
            (('lines' in mark) && !mark.lines.includes(line))
          )
        ) {
          throw new Error('删除节点并非指定导线编号');
        }
      }

      if (mark) {
        // 端点
        if (i === 0 || i === points.length - 1) {
          if (mark.isLinePoint()) {
            map.delete(mark.position);
          }
          else if (mark.isLineCross()) {
            mark.deleteLine(line);
          }
          else if (mark.isPartPinLine()) {
            mark.deleteLine();
          }
          else {
            throw new Error('导线端点只能出现在其他导线端点、交错节点、器件引脚处');
          }
        }
        else {
          if (mark.isLine()) {
            map.delete(mark.position);
          }
          else if (mark.isLineCover()) {
            mark.deleteLine(line);
          }
          else {
            throw new Error('删除导线时，非端点只可能有导线本身和交叠节点');
          }
        }
      }
    }
  }
}
