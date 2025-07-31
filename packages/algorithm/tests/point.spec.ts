import { describe, it, expect } from 'vitest';

import { Point, RotateMatrix, toRound } from '../src';

const formatPointList = (points: Iterable<Point>) => Array.from(points).map((node) => node.join());

describe('Point', () => {
  describe('创建节点', () => {
    it('should create points correctly', () => {
      expect(Point.from(5)).toEqual(new Point(5, 5));
      expect(Point.from([0, 0])).toEqual(new Point(0, 0));
      expect(Point.from([5, 4])).toEqual(new Point(5, 4));
      expect(new Point([0, 1], [10, 0])).toEqual(new Point(10, -1));
      expect(Point.from(5)).toEqual(Point.from([5, 5]));
    });
  });

  describe('解构赋值', () => {
    it('should support destructuring', () => {
      const [x, y] = new Point(5, 4);
      expect(x).toBe(5);
      expect(y).toBe(4);
    });
  });

  describe('isEqual()', () => {
    it('should check equality correctly', () => {
      expect(new Point(1, 2).isEqual([1, 2])).toBe(true);
      expect(new Point(3, 4).isEqual(new Point(3, 4))).toBe(true);
    });
  });

  describe('add()', () => {
    it('should add values correctly', () => {
      const node = new Point(1, 2);

      expect(node.add(1)).toEqual(new Point(2, 3));
      expect(node.add(-1)).toEqual(new Point(0, 1));

      expect(node.add([3, 5])).toEqual(new Point(4, 7));
      expect(node.add([3, 5], -1)).toEqual(new Point(-2, -3));
    });
  });

  describe('mul()', () => {
    it('should multiply values correctly', () => {
      const node = new Point(1, 2);

      expect(node.mul(3.2)).toEqual(new Point(3.2, 6.4));
      expect(node.mul(-0.12)).toEqual(new Point(-0.12, -0.24));
      expect(node.mul(0.5, -1)).toEqual(new Point(2, 4));

      expect(node.mul([3.7, 5.4])).toEqual(new Point(3.7, 10.8));
      expect(node.mul([2, 4], -1)).toEqual(new Point(0.5, 0.5));
    });
  });

  describe('product()', () => {
    it('should calculate product correctly', () => {
      const node = new Point(1, 2);

      expect(node.product([2, 4])).toBe(10);
      expect(toRound(node.product([0.1, 0.8]))).toBe(1.7);
    });
  });

  describe('rotate()', () => {
    it('should rotate correctly', () => {
      const node = new Point(1, 2);
      const ma: RotateMatrix = [[0, 1], [-1, 0]];

      const node1 = node.rotate(ma);
      const node2 = node1.rotate(ma);

      expect(node1).toEqual(new Point(-2, 1));
      expect(node2).toEqual(new Point(-1, -2));
    });
  });

  describe('abs()', () => {
    it('should return absolute values', () => {
      expect(new Point(1, 2).abs()).toEqual(new Point(1, 2));
      expect(new Point(-1, 2).abs()).toEqual(new Point(1, 2));
      expect(new Point(1, -2).abs()).toEqual(new Point(1, 2));
      expect(new Point(-1, -2).abs()).toEqual(new Point(1, 2));
    });
  });

  describe('sign()', () => {
    it('should return sign values', () => {
      expect(new Point(0.1, 2).sign()).toEqual(new Point(1, 1));
      expect(new Point(-0.1, 2).sign()).toEqual(new Point(-1, 1));
      expect(new Point(0.1, -2).sign()).toEqual(new Point(1, -1));
      expect(new Point(-0.1, -2).sign()).toEqual(new Point(-1, -1));
    });
  });

  describe('distance()', () => {
    it('should calculate distance correctly', () => {
      expect(new Point(3, 4).distance([0, 0])).toBe(5);
      expect(new Point(5, 5).distance([2, 1])).toBe(5);
    });
  });

  describe('toUnit()', () => {
    it('should convert to unit vector', () => {
      expect(new Point(3, 4).toUnit().map((n) => toRound(n))).toEqual([0.6, 0.8]);
      expect(new Point(6, 8).toUnit().map((n) => toRound(n))).toEqual([0.6, 0.8]);
      expect(new Point(6, 8).toUnit(10).map((n) => toRound(n))).toEqual([6, 8]);
      expect(new Point(1, 1).toUnit().map((n) => toRound(n, 8))).toEqual([0.70710678, 0.70710678]);
    });
  });

  describe('round()', () => {
    it('should round values correctly', () => {
      expect(new Point(912, 830).round()).toEqual(new Point(920, 840));
      expect(new Point(912, 835).round(10)).toEqual(new Point(910, 840));
      expect(new Point(-575, -328).round()).toEqual(new Point(-580, -320));
      expect(new Point(-575, -328).round(10)).toEqual(new Point(-580, -330));

      expect(new Point(912, 830).roundToSmall()).toEqual(new Point(46, 42));
      expect(new Point(912, 835).roundToSmall(10)).toEqual(new Point(91, 84));
      expect(new Point(-575, -328).roundToSmall()).toEqual(new Point(-29, -16));
      expect(new Point(-575, -328).roundToSmall(10)).toEqual(new Point(-58, -33));
    });
  });

  describe('floor()', () => {
    it('should floor values correctly', () => {
      expect(new Point(912, 830).floor()).toEqual(new Point(900, 820));
      expect(new Point(912, 835).floor(10)).toEqual(new Point(910, 830));
      expect(new Point(-575, -328).floor()).toEqual(new Point(-580, -340));
      expect(new Point(-575, -328).floor(10)).toEqual(new Point(-580, -330));

      expect(new Point(912, 830).floorToSmall()).toEqual(new Point(45, 41));
      expect(new Point(912, 835).floorToSmall(10)).toEqual(new Point(91, 83));
      expect(new Point(-575, -328).floorToSmall()).toEqual(new Point(-29, -17));
      expect(new Point(-575, -328).floorToSmall(10)).toEqual(new Point(-58, -33));
    });
  });

  describe('isZero()', () => {
    it('should check if point is zero', () => {
      expect(Point.from(2).isZero()).toBe(false);
      expect(new Point(2, 3).isZero()).toBe(false);
    });
  });

  describe('isInteger()', () => {
    it('should check if point has integer coordinates', () => {
      expect(Point.from(2).isInteger()).toBe(true);
      expect(Point.from(2.1).isInteger()).toBe(false);
      expect(new Point(2.1, 0.5).isInteger()).toBe(false);
    });
  });

  describe('isParallel()', () => {
    it('should check if vectors are parallel', () => {
      expect(Point.from(0).isParallel([-1, 2])).toBe(true);
      expect(Point.from(0).isParallel([2, 10])).toBe(true);

      expect(new Point(1, -2).isParallel([-1, 2])).toBe(true);
      expect(new Point(1, -2).isParallel([2, -4])).toBe(true);

      expect(new Point(1, -2).isParallel([2, 4])).toBe(false);
    });
  });

  describe('isVertical()', () => {
    it('should check if vectors are vertical', () => {
      expect(new Point(1, -2).isVertical([2, 1])).toBe(true);
      expect(new Point(1, -4).isVertical([4, 1])).toBe(true);
      expect(new Point(0, -4).isVertical([-4, 1])).toBe(false);
    });
  });

  describe('isSameDirection()', () => {
    it('should check if vectors have same direction', () => {
      expect(new Point(1, -2).isSameDirection([2, -4])).toBe(true);
      expect(new Point(1, -2).isSameDirection([-2, 4])).toBe(false);

      expect(new Point(0, -2).isSameDirection([0, -1])).toBe(true);
      expect(new Point(1, 0).isSameDirection([2, 0])).toBe(true);
      expect(new Point(0, -2).isSameDirection([0, 1])).toBe(false);
      expect(new Point(1, 0).isSameDirection([-2, 0])).toBe(false);

      // 零向量和任何向量都同向
      expect(Point.from(0).isSameDirection([-1, 0])).toBe(true);
      expect(Point.from(0).isSameDirection([0, 0])).toBe(true);
    });
  });

  describe('isOppositeDirection()', () => {
    it('should check if vectors have opposite direction', () => {
      expect(new Point(1, -2).isOppositeDirection([2, -4])).toBe(false);
      expect(new Point(1, -2).isOppositeDirection([-2, 4])).toBe(true);

      expect(new Point(0, -2).isOppositeDirection([0, -1])).toBe(false);
      expect(new Point(1, 0).isOppositeDirection([2, 0])).toBe(false);
      expect(new Point(0, -2).isOppositeDirection([0, 1])).toBe(true);
      expect(new Point(1, 0).isOppositeDirection([-2, 0])).toBe(true);

      // 零向量和任何向量都反向
      expect(Point.from(0).isOppositeDirection([-1, 0])).toBe(true);
      expect(Point.from(0).isOppositeDirection([0, 0])).toBe(true);
    });
  });

  describe('isInLine()', () => {
    it('should check if point is in line', () => {
      expect(new Point(1, 1).isInLine([[0, 0], [2, 2]])).toBe(true);
      expect(new Point(-1, -1).isInLine([[0, 0], [2, 2]])).toBe(false);

      expect(new Point(0, 1).isInLine([[0, 0], [0, 2]])).toBe(true);
      expect(new Point(0, -1).isInLine([[0, 0], [0, 2]])).toBe(false);

      expect(new Point(1, 0).isInLine([[0, 0], [2, 0]])).toBe(true);
      expect(new Point(-1, 0).isInLine([[0, 0], [2, 0]])).toBe(false);
    });
  });

  describe('join()', () => {
    it('should join coordinates correctly', () => {
      expect(new Point(1, 0).join()).toBe('1,0');
      expect(new Point(1, 0).join(', ')).toBe('1, 0');
      expect(new Point(1, 0).join('abs')).toBe('1abs0');
    });
  });

  describe('toGrid()', () => {
    it('should create grid points correctly', () => {
      const grid1 = new Point(1, 2).toGrid(3);
      expect(grid1[0]).toEqual(new Point(1, 2));
      expect(grid1[1]).toEqual(new Point(4, 2));
      expect(grid1[2]).toEqual(new Point(1, 5));
      expect(grid1[3]).toEqual(new Point(4, 5));

      const grid2 = new Point(1, 2).toGrid();
      expect(grid2[0]).toEqual(new Point(1, 2));
      expect(grid2[1]).toEqual(new Point(21, 2));
      expect(grid2[2]).toEqual(new Point(1, 22));
      expect(grid2[3]).toEqual(new Point(21, 22));
    });
  });

  describe('closest()', () => {
    it('should find closest point', () => {
      expect(() => Point.from(0).closest([])).toThrow('(point) points can not be a empty array.');

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
    it('should find vector with minimum angle', () => {
      expect(() => Point.from(0).minAngle([])).toThrow('(point) vectors can not be a empty array.');

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
    it('should generate points around with distance limit', () => {
      let ans: string[];

      const point = new Point(5, -4);
      const distanceLimit = (
        (limit: number) =>
          (node: Point) =>
            (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
      );

      ans = formatPointList(point.around(distanceLimit(-1), 5));
      expect(ans).toEqual(['5,-4']);

      ans = formatPointList(point.around(distanceLimit(0), 5));
      expect(ans).toEqual(['5,1', '5,-9', '10,-4', '0,-4']);

      ans = formatPointList(point.around(distanceLimit(10), 5));
      expect(ans).toEqual(['5,11', '5,-19', '20,-4', '-10,-4']);

      ans = formatPointList(point.around(distanceLimit(10)));
      expect(ans).toEqual(['5,7', '5,-15', '16,-4', '-6,-4']);
    });
  });

  describe('toDestination()', () => {
    it('should generate points to destination', () => {
      const start = new Point(5, 0);
      const end = new Point(8, 0);

      expect(
        formatPointList(start.toDestination(start, 1)),
      ).toEqual(['5,0']);

      expect(
        formatPointList(start.toDestination(end, 1)),
      ).toEqual(['5,0', '6,0', '7,0', '8,0']);

      expect(
        formatPointList(start.toDestination(end, 2)),
      ).toEqual(['5,0', '7,0', '9,0']);
    });
  });
});
