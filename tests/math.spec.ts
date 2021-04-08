import test from 'ava';

import { Point, Matrix, toRound } from 'src/math';

test('创建 Point', ({ deepEqual }) => {
  deepEqual(Point.from(5), new Point(5, 5));
  deepEqual(Point.from([0, 0]), new Point(0, 0));
  deepEqual(Point.from([5, 4]), new Point(5, 4));
  deepEqual(new Point([0, 1], [10, 0]), new Point(10, -1));
  deepEqual(Point.from(5), Point.from([5, 5]));
});

test('Point 解构赋值', ({ is }) => {
  const [x, y] = new Point(5, 4);
  is(x, 5);
  is(y, 4);
});

//   test('Point.prototype.isEqual()', ({ deepEqual }) => {
//     deepEqual(new Point(1, 2).isEqual([1, 2])).toBe(true);
//     deepEqual(new Point(3, 4).isEqual(new Point(3, 4))).toBe(true);
//   });
//   test('Point.prototype.add()', ({ deepEqual }) => {
//     const node = new Point(1, 2);

//     deepEqual(node.add(1), new Point(2, 3));
//     deepEqual(node.add(-1), new Point(0, 1));

//     deepEqual(node.add([3, 5]), new Point(4, 7));
//     deepEqual(node.add([3, 5], -1), new Point(-2, -3));
//   });
//   test('Point.prototype.mul()', ({ deepEqual }) => {
//     const node = new Point(1, 2);

//     deepEqual(node.mul(3.2), new Point(3.2, 6.4));
//     deepEqual(node.mul(-0.12), new Point(-0.12, -0.24));
//     deepEqual(node.mul(0.5, -1), new Point(2, 4));

//     deepEqual(node.mul([3.7, 5.4]), new Point(3.7, 10.8));
//     deepEqual(node.mul([2, 4], -1), new Point(0.5, 0.5));
//   });
//   test('Point.prototype.product()', ({ deepEqual }) => {
//     const node = new Point(1, 2);

//     deepEqual(node.product([2, 4]), 10);
//     deepEqual(toRound(node.product([0.1, 0.8])), 1.7);
//   });
//   test('Point.prototype.rotate()', ({ deepEqual }) => {
//     const node = new Point(1, 2);
//     const ma = Matrix.from([[0, 1], [-1, 0]]);   // 逆时针旋转矩阵

//     const node1 = node.rotate(ma);
//     const node2 = node1.rotate(ma);

//     deepEqual(node1, new Point(-2, 1));
//     deepEqual(node2, new Point(-1, -2));
//   });
//   test('Point.prototype.abs()', ({ deepEqual }) => {
//     deepEqual(new Point(1, 2).abs(), new Point(1, 2));
//     deepEqual(new Point(-1, 2).abs(), new Point(1, 2));
//     deepEqual(new Point(1, -2).abs(), new Point(1, 2));
//     deepEqual(new Point(-1, -2).abs(), new Point(1, 2));
//   });
//   test('Point.prototype.sign()', ({ deepEqual }) => {
//     deepEqual(new Point(0.1, 2).sign(), new Point(1, 1));
//     deepEqual(new Point(-0.1, 2).sign(), new Point(-1, 1));
//     deepEqual(new Point(0.1, -2).sign(), new Point(1, -1));
//     deepEqual(new Point(-0.1, -2).sign(), new Point(-1, -1));
//   });
//   test('Point.prototype.distance()', ({ deepEqual }) => {
//     deepEqual(new Point(3, 4).distance([0, 0]), 5);
//     deepEqual(new Point(5, 5).distance([2, 1]), 5);
//   });
//   test('Point.prototype.toUnit()', ({ deepEqual }) => {
//     deepEqual(new Point(3, 4).toUnit().map((n, i) => toRound(n)), [0.6, 0.8]);
//     deepEqual(new Point(6, 8).toUnit().map((n, i) => toRound(n)), [0.6, 0.8]);
//     deepEqual(new Point(6, 8).toUnit(10).map((n, i) => toRound(n)), [6, 8]);
//     deepEqual(new Point(1, 1).toUnit().map((n, i) => toRound(n, 8)), [0.70710678, 0.70710678]);
//   });
//   test('Point.prototype.round()', ({ deepEqual }) => {
//     deepEqual(new Point(912, 830).round(), new Point(920, 840));
//     deepEqual(new Point(912, 835).round(10), new Point(910, 840));
//     deepEqual(new Point(-575, -328).round(), new Point(-580, -320));
//     deepEqual(new Point(-575, -328).round(10), new Point(-580, -330));

//     deepEqual(new Point(912, 830).roundToSmall(), new Point(46, 42));
//     deepEqual(new Point(912, 835).roundToSmall(10), new Point(91, 84));
//     deepEqual(new Point(-575, -328).roundToSmall(), new Point(-29, -16));
//     deepEqual(new Point(-575, -328).roundToSmall(10), new Point(-58, -33));
//   });
//   test('Point.prototype.floor()', ({ deepEqual }) => {
//     deepEqual(new Point(912, 830).floor(), new Point(900, 820));
//     deepEqual(new Point(912, 835).floor(10), new Point(910, 830));
//     deepEqual(new Point(-575, -328).floor(), new Point(-580, -340));
//     deepEqual(new Point(-575, -328).floor(10), new Point(-580, -330));

//     deepEqual(new Point(912, 830).floorToSmall(), new Point(45, 41));
//     deepEqual(new Point(912, 835).floorToSmall(10), new Point(91, 83));
//     deepEqual(new Point(-575, -328).floorToSmall(), new Point(-29, -17));
//     deepEqual(new Point(-575, -328).floorToSmall(10), new Point(-58, -33));
//   });
//   test('Point.prototype.isZero()', ({ deepEqual }) => {
//     deepEqual(Point.from(2).isZero()).toBeFalse();
//     deepEqual(new Point(2, 3).isZero()).toBeFalse();
//   });
//   test('Point.prototype.isInteger()', ({ deepEqual }) => {
//     deepEqual(Point.from(2).isInteger()).toBeTrue();
//     deepEqual(Point.from(2.1).isInteger()).toBeFalse();
//     deepEqual(new Point(2.1, 0.5).isInteger()).toBeFalse();
//   });
//   test('Point.prototype.isParallel()', ({ deepEqual }) => {
//     deepEqual(Point.from(0).isParallel([-1, 2])).toBeTrue();
//     deepEqual(Point.from(0).isParallel([2, 10])).toBeTrue();

//     deepEqual(new Point(1, -2).isParallel([-1, 2])).toBeTrue();
//     deepEqual(new Point(1, -2).isParallel([2, -4])).toBeTrue();

//     deepEqual(new Point(1, -2).isParallel([2, 4])).toBeFalse();
//   });
//   test('Point.prototype.isVertical()', ({ deepEqual }) => {
//     deepEqual(new Point(1, -2).isVertical([2, 1])).toBeTrue();
//     deepEqual(new Point(1, -4).isVertical([4, 1])).toBeTrue();
//     deepEqual(new Point(0, -4).isVertical([-4, 1])).toBeFalse();
//   });
//   test('Point.prototype.isSameDirection()', ({ deepEqual }) => {
//     deepEqual(new Point(1, -2).isSameDirection([2, -4])).toBeTrue();
//     deepEqual(new Point(1, -2).isSameDirection([-2, 4])).toBeFalse();

//     deepEqual(new Point(0, -2).isSameDirection([0, -1])).toBeTrue();
//     deepEqual(new Point(1, 0).isSameDirection([2, 0])).toBeTrue();
//     deepEqual(new Point(0, -2).isSameDirection([0, 1])).toBeFalse();
//     deepEqual(new Point(1, 0).isSameDirection([-2, 0])).toBeFalse();

//     // 零向量和任何向量都同向
//     deepEqual(Point.from(0).isSameDirection([-1, 0])).toBeTrue();
//     deepEqual(Point.from(0).isSameDirection([0, 0])).toBeTrue();
//   });
//   test('Point.prototype.isOppoDirection()', ({ deepEqual }) => {
//     deepEqual(new Point(1, -2).isOppoDirection([2, -4])).toBeFalse();
//     deepEqual(new Point(1, -2).isOppoDirection([-2, 4])).toBeTrue();

//     deepEqual(new Point(0, -2).isOppoDirection([0, -1])).toBeFalse();
//     deepEqual(new Point(1, 0).isOppoDirection([2, 0])).toBeFalse();
//     deepEqual(new Point(0, -2).isOppoDirection([0, 1])).toBeTrue();
//     deepEqual(new Point(1, 0).isOppoDirection([-2, 0])).toBeTrue();

//     // 零向量和任何向量都反向
//     deepEqual(Point.from(0).isOppoDirection([-1, 0])).toBeTrue();
//     deepEqual(Point.from(0).isOppoDirection([0, 0])).toBeTrue();
//   });
//   test('Point.prototype.isInLine()', ({ deepEqual }) => {
//     deepEqual(new Point(1, 1).isInLine([[0, 0], [2, 2]])).toBeTrue();
//     deepEqual(new Point(-1, -1).isInLine([[0, 0], [2, 2]])).toBeFalse();

//     deepEqual(new Point(0, 1).isInLine([[0, 0], [0, 2]])).toBeTrue();
//     deepEqual(new Point(0, -1).isInLine([[0, 0], [0, 2]])).toBeFalse();

//     deepEqual(new Point(1, 0).isInLine([[0, 0], [2, 0]])).toBeTrue();
//     deepEqual(new Point(-1, 0).isInLine([[0, 0], [2, 0]])).toBeFalse();
//   });
//   test('Point.prototype.join()', ({ deepEqual }) => {
//     deepEqual(new Point(1, 0).join(), '1,0');
//     deepEqual(new Point(1, 0).join(', '), '1, 0');
//     deepEqual(new Point(1, 0).join('abs'), '1abs0');
//   });
//   test('Point.prototype.toGrid()', ({ deepEqual }) => {
//     const grid1 = new Point(1, 2).toGrid(3);
//     deepEqual(grid1[0], new Point(1, 2));
//     deepEqual(grid1[1], new Point(4, 2));
//     deepEqual(grid1[2], new Point(1, 5));
//     deepEqual(grid1[3], new Point(4, 5));

//     const grid2 = new Point(1, 2).toGrid();
//     deepEqual(grid2[0], new Point(1, 2));
//     deepEqual(grid2[1], new Point(21, 2));
//     deepEqual(grid2[2], new Point(1, 22));
//     deepEqual(grid2[3], new Point(21, 22));
//   });
//   test('Point.prototype.closest()', ({ deepEqual }) => {
//     deepEqual(() => Point.from(0).closest([])).toThrowError('(point) points can not be a empty array.');
//     deepEqual(Point.from(0).closest([[1, 2], [0.5, 0.4], [-10, 50], [0.3, -0.8], [-1, -0.1]]), new Point(0.5, 0.4));
//   });
//   test('Point.prototype.minAngle()', ({ deepEqual }) => {
//     deepEqual(() => Point.from(0).minAngle([])).toThrowError('(point) vectors can not be a empty array.');
//     deepEqual(new Point(1, 1).minAngle([[1, 2], [0.5, 0.4], [-10, 50], [0.3, -0.8], [-1, -0.1]]), new Point(0.5, 0.4));
//   });
//   test('Point.prototype.everyRect()', ({ deepEqual }) => {
//     const count: string[] = [];

//     const point = new Point(0, 0);
//     const margin = [[-1, -1], [2, 1]];

//     const all = point.everyRect(margin, (node) => Boolean(count.push(node.join())));

//     deepEqual(all).toBeTrue();
//     deepEqual(count, ['-1,-1', '-1,0', '-1,1', '0,-1', '0,0', '0,1', '1,-1', '1,0', '1,1', '2,-1', '2,0', '2,1']);

//     count.length = 0;

//     const part = point.everyRect(margin, (node) => {
//       count.push(node.join());
//       return  (node[0] < 0 || node[1] < 0);
//     });

//     deepEqual(part).toBeFalse();
//     deepEqual(count, ['-1,-1', '-1,0', '-1,1', '0,-1', '0,0']);
//   });
//   test('Point.prototype.around()', ({ deepEqual }) => {
//     let ans: string[];

//     const point = new Point(5, -4);
//     const distanceLimit = (
//       (limit: number) =>
//         (node: Point) =>
//           (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
//     );

//     ans = point.around(distanceLimit(-1), 5).map((node) => node.join());
//     deepEqual(ans, ['5,-4']);

//     ans = point.around(distanceLimit(0), 5).map((node) => node.join());
//     deepEqual(ans, ['5,1', '5,-9', '10,-4', '0,-4']);

//     ans = point.around(distanceLimit(10), 5).map((node) => node.join());
//     deepEqual(ans, ['5,11', '5,-19', '20,-4', '-10,-4']);

//     ans = point.around(distanceLimit(10)).map((node) => node.join());
//     deepEqual(ans, ['5,7', '5,-15', '16,-4', '-6,-4']);
//   });
