import { describe, it, expect } from 'vitest';

import { Point, RotateMatrix, toRound } from '../src';

const formatPointList = (points: Iterable<Point>) => Array.from(points).map((node) => node.join());

describe('Point', () => {
  describe('创建节点', () => {
    it('从数字创建点应该正确', () => {
      expect(Point.from(5)).toEqual(new Point(5, 5));
      expect(Point.from(5)).toEqual(Point.from([5, 5]));
    });

    it('从数组创建点应该正确', () => {
      expect(Point.from([0, 0])).toEqual(new Point(0, 0));
      expect(Point.from([5, 4])).toEqual(new Point(5, 4));
    });

    it('从两个数组创建点应该正确', () => {
      expect(new Point([0, 1], [10, 0])).toEqual(new Point(10, -1));
    });
  });

  describe('解构赋值', () => {
    it('应该支持解构赋值', () => {
      const [x, y] = new Point(5, 4);
      expect(x).toBe(5);
      expect(y).toBe(4);
    });
  });

  describe('isEqual()', () => {
    it('与数组比较应该正确', () => {
      expect(new Point(1, 2).isEqual([1, 2])).toBe(true);
    });

    it('与Point对象比较应该正确', () => {
      expect(new Point(3, 4).isEqual(new Point(3, 4))).toBe(true);
    });
  });

  describe('add()', () => {
    it('添加数字应该正确', () => {
      const node = new Point(1, 2);
      expect(node.add(1)).toEqual(new Point(2, 3));
      expect(node.add(-1)).toEqual(new Point(0, 1));
    });

    it('添加数组应该正确', () => {
      const node = new Point(1, 2);
      expect(node.add([3, 5])).toEqual(new Point(4, 7));
    });

    it('添加数组和系数应该正确', () => {
      const node = new Point(1, 2);
      expect(node.add([3, 5], -1)).toEqual(new Point(-2, -3));
    });
  });

  describe('mul()', () => {
    it('乘以数字应该正确', () => {
      const node = new Point(1, 2);
      expect(node.mul(3.2)).toEqual(new Point(3.2, 6.4));
      expect(node.mul(-0.12)).toEqual(new Point(-0.12, -0.24));
    });

    it('乘以数字和系数应该正确', () => {
      const node = new Point(1, 2);
      expect(node.mul(0.5, -1)).toEqual(new Point(2, 4));
    });

    it('乘以数组应该正确', () => {
      const node = new Point(1, 2);
      expect(node.mul([3.7, 5.4])).toEqual(new Point(3.7, 10.8));
    });

    it('乘以数组和系数应该正确', () => {
      const node = new Point(1, 2);
      expect(node.mul([2, 4], -1)).toEqual(new Point(0.5, 0.5));
    });
  });

  describe('product()', () => {
    it('计算点积应该正确', () => {
      const node = new Point(1, 2);
      expect(node.product([2, 4])).toBe(10);
    });

    it('计算小数点积应该正确', () => {
      const node = new Point(1, 2);
      expect(toRound(node.product([0.1, 0.8]))).toBe(1.7);
    });
  });

  describe('rotate()', () => {
    it('旋转一次应该正确', () => {
      const node = new Point(1, 2);
      const ma: RotateMatrix = [[0, 1], [-1, 0]];
      const node1 = node.rotate(ma);
      expect(node1).toEqual(new Point(-2, 1));
    });

    it('旋转两次应该正确', () => {
      const node = new Point(1, 2);
      const ma: RotateMatrix = [[0, 1], [-1, 0]];
      const node1 = node.rotate(ma);
      const node2 = node1.rotate(ma);
      expect(node2).toEqual(new Point(-1, -2));
    });
  });

  describe('abs()', () => {
    it('正数应该保持不变', () => {
      expect(new Point(1, 2).abs()).toEqual(new Point(1, 2));
    });

    it('负数应该取绝对值', () => {
      expect(new Point(-1, 2).abs()).toEqual(new Point(1, 2));
      expect(new Point(1, -2).abs()).toEqual(new Point(1, 2));
      expect(new Point(-1, -2).abs()).toEqual(new Point(1, 2));
    });
  });

  describe('sign()', () => {
    it('正数应该返回1', () => {
      expect(new Point(0.1, 2).sign()).toEqual(new Point(1, 1));
    });

    it('负数应该返回-1', () => {
      expect(new Point(-0.1, 2).sign()).toEqual(new Point(-1, 1));
      expect(new Point(0.1, -2).sign()).toEqual(new Point(1, -1));
      expect(new Point(-0.1, -2).sign()).toEqual(new Point(-1, -1));
    });
  });

  describe('distance()', () => {
    it('计算到原点的距离应该正确', () => {
      expect(new Point(3, 4).distance([0, 0])).toBe(5);
    });

    it('计算到其他点的距离应该正确', () => {
      expect(new Point(5, 5).distance([2, 1])).toBe(5);
    });
  });

  describe('toUnit()', () => {
    it('转换为单位向量应该正确', () => {
      expect(new Point(3, 4).toUnit().map((n) => toRound(n))).toEqual([0.6, 0.8]);
      expect(new Point(6, 8).toUnit().map((n) => toRound(n))).toEqual([0.6, 0.8]);
    });

    it('指定长度的单位向量应该正确', () => {
      expect(new Point(6, 8).toUnit(10).map((n) => toRound(n))).toEqual([6, 8]);
    });

    it('对角线向量应该正确', () => {
      expect(new Point(1, 1).toUnit().map((n) => toRound(n, 8))).toEqual([0.70710678, 0.70710678]);
    });
  });

  describe('round()', () => {
    it('默认精度四舍五入应该正确', () => {
      expect(new Point(912, 830).round()).toEqual(new Point(920, 840));
      expect(new Point(-575, -328).round()).toEqual(new Point(-580, -320));
    });

    it('指定精度四舍五入应该正确', () => {
      expect(new Point(912, 835).round(10)).toEqual(new Point(910, 840));
      expect(new Point(-575, -328).round(10)).toEqual(new Point(-580, -330));
    });

    it('默认精度向小四舍五入应该正确', () => {
      expect(new Point(912, 830).roundToSmall()).toEqual(new Point(46, 42));
      expect(new Point(-575, -328).roundToSmall()).toEqual(new Point(-29, -16));
    });

    it('指定精度向小四舍五入应该正确', () => {
      expect(new Point(912, 835).roundToSmall(10)).toEqual(new Point(91, 84));
      expect(new Point(-575, -328).roundToSmall(10)).toEqual(new Point(-58, -33));
    });
  });

  describe('floor()', () => {
    it('默认精度向下取整应该正确', () => {
      expect(new Point(912, 830).floor()).toEqual(new Point(900, 820));
      expect(new Point(-575, -328).floor()).toEqual(new Point(-580, -340));
    });

    it('指定精度向下取整应该正确', () => {
      expect(new Point(912, 835).floor(10)).toEqual(new Point(910, 830));
      expect(new Point(-575, -328).floor(10)).toEqual(new Point(-580, -330));
    });

    it('默认精度向小向下取整应该正确', () => {
      expect(new Point(912, 830).floorToSmall()).toEqual(new Point(45, 41));
      expect(new Point(-575, -328).floorToSmall()).toEqual(new Point(-29, -17));
    });

    it('指定精度向小向下取整应该正确', () => {
      expect(new Point(912, 835).floorToSmall(10)).toEqual(new Point(91, 83));
      expect(new Point(-575, -328).floorToSmall(10)).toEqual(new Point(-58, -33));
    });
  });

  describe('isZero()', () => {
    it('非零点应该返回false', () => {
      expect(Point.from(2).isZero()).toBe(false);
      expect(new Point(2, 3).isZero()).toBe(false);
    });
  });

  describe('isInteger()', () => {
    it('整数坐标应该返回true', () => {
      expect(Point.from(2).isInteger()).toBe(true);
    });

    it('小数坐标应该返回false', () => {
      expect(Point.from(2.1).isInteger()).toBe(false);
      expect(new Point(2.1, 0.5).isInteger()).toBe(false);
    });
  });

  describe('isParallel()', () => {
    it('零向量应该与任何向量平行', () => {
      expect(Point.from(0).isParallel([-1, 2])).toBe(true);
      expect(Point.from(0).isParallel([2, 10])).toBe(true);
    });

    it('平行向量应该返回true', () => {
      expect(new Point(1, -2).isParallel([-1, 2])).toBe(true);
      expect(new Point(1, -2).isParallel([2, -4])).toBe(true);
    });

    it('不平行向量应该返回false', () => {
      expect(new Point(1, -2).isParallel([2, 4])).toBe(false);
    });
  });

  describe('isVertical()', () => {
    it('垂直向量应该返回true', () => {
      expect(new Point(1, -2).isVertical([2, 1])).toBe(true);
      expect(new Point(1, -4).isVertical([4, 1])).toBe(true);
    });

    it('不垂直向量应该返回false', () => {
      expect(new Point(0, -4).isVertical([-4, 1])).toBe(false);
    });
  });

  describe('isSameDirection()', () => {
    it('同向向量应该返回true', () => {
      expect(new Point(1, -2).isSameDirection([2, -4])).toBe(true);
      expect(new Point(0, -2).isSameDirection([0, -1])).toBe(true);
      expect(new Point(1, 0).isSameDirection([2, 0])).toBe(true);
    });

    it('反向向量应该返回false', () => {
      expect(new Point(1, -2).isSameDirection([-2, 4])).toBe(false);
      expect(new Point(0, -2).isSameDirection([0, 1])).toBe(false);
      expect(new Point(1, 0).isSameDirection([-2, 0])).toBe(false);
    });

    it('零向量应该与任何向量同向', () => {
      expect(Point.from(0).isSameDirection([-1, 0])).toBe(true);
      expect(Point.from(0).isSameDirection([0, 0])).toBe(true);
    });
  });

  describe('isOppositeDirection()', () => {
    it('同向向量应该返回false', () => {
      expect(new Point(1, -2).isOppositeDirection([2, -4])).toBe(false);
      expect(new Point(0, -2).isOppositeDirection([0, -1])).toBe(false);
      expect(new Point(1, 0).isOppositeDirection([2, 0])).toBe(false);
    });

    it('反向向量应该返回true', () => {
      expect(new Point(1, -2).isOppositeDirection([-2, 4])).toBe(true);
      expect(new Point(0, -2).isOppositeDirection([0, 1])).toBe(true);
      expect(new Point(1, 0).isOppositeDirection([-2, 0])).toBe(true);
    });

    it('零向量应该与任何向量反向', () => {
      expect(Point.from(0).isOppositeDirection([-1, 0])).toBe(true);
      expect(Point.from(0).isOppositeDirection([0, 0])).toBe(true);
    });
  });

  describe('isInLine()', () => {
    it('在线上的点应该返回true', () => {
      expect(new Point(1, 1).isInLine([[0, 0], [2, 2]])).toBe(true);
      expect(new Point(0, 1).isInLine([[0, 0], [0, 2]])).toBe(true);
      expect(new Point(1, 0).isInLine([[0, 0], [2, 0]])).toBe(true);
    });

    it('不在线上的点应该返回false', () => {
      expect(new Point(-1, -1).isInLine([[0, 0], [2, 2]])).toBe(false);
      expect(new Point(0, -1).isInLine([[0, 0], [0, 2]])).toBe(false);
      expect(new Point(-1, 0).isInLine([[0, 0], [2, 0]])).toBe(false);
    });
  });

  describe('join()', () => {
    it('默认分隔符应该正确', () => {
      expect(new Point(1, 0).join()).toBe('1,0');
    });

    it('自定义分隔符应该正确', () => {
      expect(new Point(1, 0).join(', ')).toBe('1, 0');
      expect(new Point(1, 0).join('abs')).toBe('1abs0');
    });
  });

  describe('toGrid()', () => {
    it('指定间距的网格应该正确', () => {
      const grid1 = new Point(1, 2).toGrid(3);
      expect(grid1[0]).toEqual(new Point(1, 2));
      expect(grid1[1]).toEqual(new Point(4, 2));
      expect(grid1[2]).toEqual(new Point(1, 5));
      expect(grid1[3]).toEqual(new Point(4, 5));
    });

    it('默认间距的网格应该正确', () => {
      const grid2 = new Point(1, 2).toGrid();
      expect(grid2[0]).toEqual(new Point(1, 2));
      expect(grid2[1]).toEqual(new Point(21, 2));
      expect(grid2[2]).toEqual(new Point(1, 22));
      expect(grid2[3]).toEqual(new Point(21, 22));
    });
  });

  describe('closest()', () => {
    it('空数组应该抛出异常', () => {
      expect(() => Point.from(0).closest([])).toThrow('(point) points can not be a empty array.');
    });

    it('应该找到最近的点', () => {
      expect(
        Point.from(0).closest([
          [1, 2],
          [0.5, 0.4],
          [-10, 50],
          [0.3, -0.8],
          [-1, -0.1],
        ]),
      ).toEqual(new Point(0.5, 0.4));
    });
  });

  describe('minAngle()', () => {
    it('空数组应该抛出异常', () => {
      expect(() => Point.from(0).minAngle([])).toThrow('(point) vectors can not be a empty array.');
    });

    it('应该找到最小角度的向量', () => {
      expect(
        new Point(1, 1).minAngle([
          [1, 2],
          [0.5, 0.4],
          [-10, 50],
          [0.3, -0.8],
          [-1, -0.1],
        ]),
      ).toEqual(new Point(0.5, 0.4));
    });
  });

  describe('around()', () => {
    it('距离限制为负数时应该只返回原点', () => {
      const point = new Point(5, -4);
      const distanceLimit = (
        (limit: number) =>
          (node: Point) =>
            (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
      );

      const ans = formatPointList(point.around(distanceLimit(-1), 5));
      expect(ans).toEqual(['5,-4']);
    });

    it('距离限制为0时应该返回相邻点', () => {
      const point = new Point(5, -4);
      const distanceLimit = (
        (limit: number) =>
          (node: Point) =>
            (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
      );

      const ans = formatPointList(point.around(distanceLimit(0), 5));
      expect(ans).toEqual(['5,1', '5,-9', '10,-4', '0,-4']);
    });

    it('距离限制为10时应该返回更多点', () => {
      const point = new Point(5, -4);
      const distanceLimit = (
        (limit: number) =>
          (node: Point) =>
            (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
      );

      const ans = formatPointList(point.around(distanceLimit(10), 5));
      expect(ans).toEqual(['5,11', '5,-19', '20,-4', '-10,-4']);
    });

    it('默认间距应该正确', () => {
      const point = new Point(5, -4);
      const distanceLimit = (
        (limit: number) =>
          (node: Point) =>
            (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
      );

      const ans = formatPointList(point.around(distanceLimit(10)));
      expect(ans).toEqual(['5,7', '5,-15', '16,-4', '-6,-4']);
    });
  });

  describe('toDestination()', () => {
    it('起点和终点相同时应该只返回起点', () => {
      const start = new Point(5, 0);
      expect(
        formatPointList(start.toDestination(start, 1)),
      ).toEqual(['5,0']);
    });

    it('步长为1时应该返回所有中间点', () => {
      const start = new Point(5, 0);
      const end = new Point(8, 0);
      expect(
        formatPointList(start.toDestination(end, 1)),
      ).toEqual(['5,0', '6,0', '7,0', '8,0']);
    });

    it('步长为2时应该返回间隔点', () => {
      const start = new Point(5, 0);
      const end = new Point(8, 0);
      expect(
        formatPointList(start.toDestination(end, 2)),
      ).toEqual(['5,0', '7,0', '9,0']);
    });
  });
});
