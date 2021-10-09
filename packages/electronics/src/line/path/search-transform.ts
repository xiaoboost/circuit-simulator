import { Point } from '@circuit/math';
import { MarkNodeKind } from '@circuit/map';
import { LinePath } from './line-path';
import { pointSearch } from './search-point';
import { Cache } from './cache';
import { Rules } from './search-rules';
import { SearchStatus } from './constant';

import type { Line } from '..';

interface CacheData {
  line: LinePath;
  index: number;
}

export class TransformSearcher {
  /** 当前导线 */
  private readonly line: Line;
  /** 初始鼠标位置 */
  private readonly start: Point;
  /** 初始导线路径 */
  private readonly origin: LinePath;
  /** 变形线段垂直单位向量 */
  private readonly vector: Point;
  /** 变形线段 */
  private readonly segment: Point[];
  /** 变形线段下标 */
  private readonly index: number;
  /** 搜索缓存 */
  private readonly cache = new Cache<Point, undefined, CacheData>((point) => {
    return `${point[0]}:${point[1]}`;
  });

  /** 当前搜索终点 */
  private end = new Point(0, 0);
  /** 待搜索的终点列表 */
  private endList: Point[] = [];

  constructor(start: Point, index: number, line: Line) {
    this.line = line;
    this.start = start;
    this.index = index;
    this.origin = LinePath.from(line.path);
    this.segment = line.path.getSegment(index);
    this.vector = new Point(this.segment[0], this.segment[1])
      .toVertical()
      .toUnit()
      .abs();
  }

  private getSearchStatus(mouse: Point) {
    const { cache, vector } = this;

    /** 沿着移动线段的垂直方向移动 */
    const end = mouse.mul(vector);
    const endFloor = end.floor(20);
    const endList = [endFloor, endFloor.add(vector.mul(20))];

    this.end = mouse;
    this.endList = endList;

    for (const end of endList) {
      if (cache.has(end)) {
        continue;
      }

      cache.set(end, this.getSearchPath(end));
    }
  }

  private getSearchPath(end: Point): CacheData {
    const { line, index, origin, vector: moveV } = this;

    /** 当前线段单位向量 */
    const moveH = moveV.toVertical().abs();
    /** 当前线段 */
    const segment = origin.getSegment(index);
    /** 终点至线段起点在垂直方向上的投影长度 */
    const maxBias = Math.abs(new Point(end, origin[index]).product(moveV));

    // 垂直方向从最大偏移量开始迭代
    for (let k = 0; k < maxBias; k += 20) {
      for (let i = -k; i <= k; i+= 2 * k) {
        /** 移动后的线段 */
        const movedSegment = segment.map((node) => {
          return node.mul(moveH).add(end.mul(moveV).add(moveV.mul(i)));
        });
        /** 替换移动后线段的新导线 */
        const newPath = this.getMovedPath(movedSegment);
        /** 移动线段在新导线中的下标 */
        const newSubIndex = newPath.getSegmentIndex(movedSegment);
        /** 移动线段在图纸中的有效部分 */
        const validSegment = this.getMovedValid(newPath, newSubIndex);

        if (!validSegment) {
          // TODO: 次要备选
          continue;
        }

        const startSegment = newPath.slice(0, newSubIndex);
        const endSegment = newPath.slice(newSubIndex + 2);

        let startSearch: LinePath;
        let endSearch: LinePath;

        if (startSegment.length > 0) {
          const start = startSegment[startSegment.length - 1];
          const end = validSegment[0];
          const vector = new Point(start, end).mul(moveV).toUnit();
          startSearch = this.removeExcess(pointSearch(
            start,
            end,
            vector,
            new Rules(start, end, SearchStatus.TranslateSpace, line.map),
          ));
        }
        else {
          startSearch = LinePath.from([newPath[0]]);
        }

        if (endSegment.length > 0) {
          const start = endSegment[0];
          const end = validSegment[1];
          const vector = new Point(start, end).mul(moveV).toUnit();
          endSearch = this.removeExcess(pointSearch(
            start,
            end,
            vector,
            new Rules(start, end, SearchStatus.TranslateSpace, line.map),
          ));
        }
        else {
          endSearch = LinePath.from([newPath.get(-1)]);
        }

        return {
          index: newSubIndex,
          line: LinePath.from(
            startSegment.concat(
              startSearch,
              validSegment,
              endSearch.reverse(),
              endSegment,
            )
          ).removeRepeat(),
        }
      }

      if (!k) {
        break;
      }
    }

    return {
      line: origin.removeRepeat(),
      index,
    };
  }

  private getLinePath(mouse: Point) {
    const { cache, endList: list } = this;
    const end = list.sort((pre, next) => {
      const prePath = cache.get(pre)?.line.length ?? 0;
      const nextPath = cache.get(next)?.line.length ?? 0;
      return prePath > nextPath ? -1 : 1;
    })[0];
    const data = cache.get(end)!;
    const way = LinePath.from(data.line.slice());
    way.setSegmentToPoint(data.index, mouse);
    return way.removeRepeat();
  }

  private removeExcess(path: LinePath) {
    return path;
  }

  /** 线段移动产生的新路径 */
  private getMovedPath(moveSegment: Point[]) {
    const { index, origin } = this;
    const newPath = origin.slice();
    newPath.splice(index, 2, ...moveSegment);
    const newLine = LinePath.from(newPath);
    newLine.unshift(Point.from(origin[0]));
    newLine.push(Point.from(origin.get(-1)));
    newLine.removeRepeat();
    return newLine;
  }

  /** 获取移动导线有效部分 */
  private getMovedValid(path: LinePath, index: number) {
    if (index === -1) {
      return;
    }

    const { line } = this;
    const pieces: Point[][] = [];
    const [start, end] = path.getSegment(index);
    const vector = new Point(start, end).toUnit().mul(20);

    const strict = (node: Point) => !line.map.has(node);
    const standard = (node: Point) => {
      const data = line.map.get(node);

      if (!data) {
        return true;
      }

      if (
        data.kind === MarkNodeKind.Part ||
        data.kind === MarkNodeKind.PartPin ||
        data.kind === MarkNodeKind.LineSpacePoint
      ) {
        return false;
      }
      else if (
        data.kind === MarkNodeKind.LineCoverPoint ||
        data.kind === MarkNodeKind.LineCrossPoint
      ) {
        for (let j = 0; j < data.connections.length; j++) {
          const connection = data.connections[j];
          const connectionVector = new Point(node, connection);

          if (vector.isParallel(connectionVector)) {
            return false;
          }
        }
      }

      return true;
    };

    let isEnd = false;
    let currentPiece: Point | null = null;

    for (let node = start; !isEnd; node = node.add(vector)) {
      const check = strict(node);

      isEnd = node.isEqual(end);
      // (node.isEqual(start) || isEnd)
      //   ? strict(node)
      //   : standard(node);

      if (check) {
        if (currentPiece) {
          if (isEnd) {
            pieces.push([currentPiece, node]);
          }
        }
        else {
          if (isEnd) {
            pieces.push([node, node]);
          }
          else {
            currentPiece = node;
          }
        }
      }
      else if (currentPiece) {
        pieces.push([currentPiece, node.add(vector, -1)]);
        currentPiece = null;
      }
    }

    let max = -1;
    let ans: Point[] = [];

    for (let i = 0; i < pieces.length; i++) {
      const distance = new Point(pieces[i][0], pieces[i][1]).distance();

      if (distance > max) {
        max = distance;
        ans = pieces[i];
      }
    }

    return ans;
  }

  searchRound() {
    const end = this.end;
    const result = this.search(end.round(20));
    this.end = end;
    return result;
  }

  search(mouse: Point) {
    this.getSearchStatus(mouse);
    return this.getLinePath(mouse);
  }
}
