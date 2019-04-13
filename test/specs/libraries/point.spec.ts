import 'src/init/native';

import Matrix from 'src/lib/matrix';
import Point from 'src/lib/point';
import { toRound } from 'src/lib/number';

describe('point.ts: class of point and vector', () => {
    test('create a instance', () => {
        expect(Point.from(5)).toEqual(new Point(5, 5));
        expect(Point.from([0, 0])).toEqual(new Point(0, 0));
        expect(Point.from([5, 4])).toEqual(new Point(5, 4));
        expect(new Point([0, 1], [10, 0])).toEqual(new Point(10, -1));

        expect(Point.from(5)).toEqual(Point.from([5, 5]));
    });
    test('Point.prototype[Symbol.iterator]()', () => {
        const node = new Point(5, 4);
        const arr: number[] = [];

        for (const v of node) {
            arr.push(v);
        }

        expect(arr).toEqual([5, 4]);
    });
    test('Point.prototype.isEqual()', () => {
        expect(new Point(1, 2).isEqual([1, 2])).toBe(true);
        expect(new Point(3, 4).isEqual(new Point(3, 4))).toBe(true);
    });
    test('Point.prototype.add()', () => {
        const node = new Point(1, 2);

        expect(node.add(1)).toEqual(new Point(2, 3));
        expect(node.add(-1)).toEqual(new Point(0, 1));

        expect(node.add([3, 5])).toEqual(new Point(4, 7));
        expect(node.add([3, 5], -1)).toEqual(new Point(-2, -3));
    });
    test('Point.prototype.mul()', () => {
        const node = new Point(1, 2);

        expect(node.mul(3.2)).toEqual(new Point(3.2, 6.4));
        expect(node.mul(-0.12)).toEqual(new Point(-0.12, -0.24));
        expect(node.mul(0.5, -1)).toEqual(new Point(2, 4));

        expect(node.mul([3.7, 5.4])).toEqual(new Point(3.7, 10.8));
        expect(node.mul([2, 4], -1)).toEqual(new Point(0.5, 0.5));
    });
    test('Point.prototype.product()', () => {
        const node = new Point(1, 2);

        expect(node.product([2, 4])).toEqual(10);
        expect(toRound(node.product([0.1, 0.8]))).toEqual(1.7);
    });
    test('Point.prototype.rotate()', () => {
        const node = new Point(1, 2);
        const ma = Matrix.from([[0, 1], [-1, 0]]);   // 逆时针旋转矩阵

        const node1 = node.rotate(ma);
        const node2 = node1.rotate(ma);

        expect(node1).toEqual(new Point(-2, 1));
        expect(node2).toEqual(new Point(-1, -2));
    });
    test('Point.prototype.abs()', () => {
        expect(new Point(1, 2).abs()).toEqual(new Point(1, 2));
        expect(new Point(-1, 2).abs()).toEqual(new Point(1, 2));
        expect(new Point(1, -2).abs()).toEqual(new Point(1, 2));
        expect(new Point(-1, -2).abs()).toEqual(new Point(1, 2));
    });
    test('Point.prototype.sign()', () => {
        expect(new Point(0.1, 2).sign()).toEqual(new Point(1, 1));
        expect(new Point(-0.1, 2).sign()).toEqual(new Point(-1, 1));
        expect(new Point(0.1, -2).sign()).toEqual(new Point(1, -1));
        expect(new Point(-0.1, -2).sign()).toEqual(new Point(-1, -1));
    });
    test('Point.prototype.distance()', () => {
        expect(new Point(3, 4).distance([0, 0])).toEqual(5);
        expect(new Point(5, 5).distance([2, 1])).toEqual(5);
    });
    test('Point.prototype.toUnit()', () => {
        expect(new Point(3, 4).toUnit().map((n, i) => toRound(n))).toEqual([0.6, 0.8]);
        expect(new Point(6, 8).toUnit().map((n, i) => toRound(n))).toEqual([0.6, 0.8]);
        expect(new Point(6, 8).toUnit(10).map((n, i) => toRound(n))).toEqual([6, 8]);
        expect(new Point(1, 1).toUnit().map((n, i) => toRound(n, 8))).toEqual([0.70710678, 0.70710678]);
    });
    test('Point.prototype.round()', () => {
        expect(new Point(912, 830).round()).toEqual(new Point(920, 840));
        expect(new Point(912, 835).round(10)).toEqual(new Point(910, 840));
        expect(new Point(-575, -328).round()).toEqual(new Point(-580, -320));
        expect(new Point(-575, -328).round(10)).toEqual(new Point(-580, -330));

        expect(new Point(912, 830).roundToSmall()).toEqual(new Point(46, 42));
        expect(new Point(912, 835).roundToSmall(10)).toEqual(new Point(91, 84));
        expect(new Point(-575, -328).roundToSmall()).toEqual(new Point(-29, -16));
        expect(new Point(-575, -328).roundToSmall(10)).toEqual(new Point(-58, -33));
    });
    test('Point.prototype.floor()', () => {
        expect(new Point(912, 830).floor()).toEqual(new Point(900, 820));
        expect(new Point(912, 835).floor(10)).toEqual(new Point(910, 830));
        expect(new Point(-575, -328).floor()).toEqual(new Point(-580, -340));
        expect(new Point(-575, -328).floor(10)).toEqual(new Point(-580, -330));

        expect(new Point(912, 830).floorToSmall()).toEqual(new Point(45, 41));
        expect(new Point(912, 835).floorToSmall(10)).toEqual(new Point(91, 83));
        expect(new Point(-575, -328).floorToSmall()).toEqual(new Point(-29, -17));
        expect(new Point(-575, -328).floorToSmall(10)).toEqual(new Point(-58, -33));
    });
    test('Point.prototype.isZero()', () => {
        expect(Point.from(2).isZero()).toBeFalse();
        expect(new Point(2, 3).isZero()).toBeFalse();
    });
    test('Point.prototype.isInteger()', () => {
        expect(Point.from(2).isInteger()).toBeTrue();
        expect(Point.from(2.1).isInteger()).toBeFalse();
        expect(new Point(2.1, 0.5).isInteger()).toBeFalse();
    });
    test('Point.prototype.isParallel()', () => {
        expect(Point.from(0).isParallel([-1, 2])).toBeTrue();
        expect(Point.from(0).isParallel([2, 10])).toBeTrue();

        expect(new Point(1, -2).isParallel([-1, 2])).toBeTrue();
        expect(new Point(1, -2).isParallel([2, -4])).toBeTrue();

        expect(new Point(1, -2).isParallel([2, 4])).toBeFalse();
    });
    test('Point.prototype.isVertical()', () => {
        expect(new Point(1, -2).isVertical([2, 1])).toBeTrue();
        expect(new Point(1, -4).isVertical([4, 1])).toBeTrue();
        expect(new Point(0, -4).isVertical([-4, 1])).toBeFalse();
    });
    test('Point.prototype.isSameDirection()', () => {
        expect(new Point(1, -2).isSameDirection([2, -4])).toBeTrue();
        expect(new Point(1, -2).isSameDirection([-2, 4])).toBeFalse();

        expect(new Point(0, -2).isSameDirection([0, -1])).toBeTrue();
        expect(new Point(1, 0).isSameDirection([2, 0])).toBeTrue();
        expect(new Point(0, -2).isSameDirection([0, 1])).toBeFalse();
        expect(new Point(1, 0).isSameDirection([-2, 0])).toBeFalse();

        // 零向量和任何向量都同向
        expect(Point.from(0).isSameDirection([-1, 0])).toBeTrue();
        expect(Point.from(0).isSameDirection([0, 0])).toBeTrue();
    });
    test('Point.prototype.isOppoDirection()', () => {
        expect(new Point(1, -2).isOppoDirection([2, -4])).toBeFalse();
        expect(new Point(1, -2).isOppoDirection([-2, 4])).toBeTrue();

        expect(new Point(0, -2).isOppoDirection([0, -1])).toBeFalse();
        expect(new Point(1, 0).isOppoDirection([2, 0])).toBeFalse();
        expect(new Point(0, -2).isOppoDirection([0, 1])).toBeTrue();
        expect(new Point(1, 0).isOppoDirection([-2, 0])).toBeTrue();

        // 零向量和任何向量都反向
        expect(Point.from(0).isOppoDirection([-1, 0])).toBeTrue();
        expect(Point.from(0).isOppoDirection([0, 0])).toBeTrue();
    });
    test('Point.prototype.isInLine()', () => {
        expect(new Point(1, 1).isInLine([[0, 0], [2, 2]])).toBeTrue();
        expect(new Point(-1, -1).isInLine([[0, 0], [2, 2]])).toBeFalse();

        expect(new Point(0, 1).isInLine([[0, 0], [0, 2]])).toBeTrue();
        expect(new Point(0, -1).isInLine([[0, 0], [0, 2]])).toBeFalse();

        expect(new Point(1, 0).isInLine([[0, 0], [2, 0]])).toBeTrue();
        expect(new Point(-1, 0).isInLine([[0, 0], [2, 0]])).toBeFalse();
    });
    test('Point.prototype.join()', () => {
        expect(new Point(1, 0).join()).toEqual('1,0');
        expect(new Point(1, 0).join(', ')).toEqual('1, 0');
        expect(new Point(1, 0).join('abs')).toEqual('1abs0');
    });
    test('Point.prototype.toGrid()', () => {
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
    test('Point.prototype.closest()', () => {
        expect(() => Point.from(0).closest([])).toThrowError('(point) points can not be a empty array.');
        expect(Point.from(0).closest([[1, 2], [0.5, 0.4], [-10, 50], [0.3, -0.8], [-1, -0.1]])).toEqual(new Point(0.5, 0.4));
    });
    test('Point.prototype.minAngle()', () => {
        expect(() => Point.from(0).minAngle([])).toThrowError('(point) vectors can not be a empty array.');
        expect(new Point(1, 1).minAngle([[1, 2], [0.5, 0.4], [-10, 50], [0.3, -0.8], [-1, -0.1]])).toEqual(new Point(0.5, 0.4));
    });
    test('Point.prototype.everyRect()', () => {
        const count: string[] = [];

        const point = new Point(0, 0);
        const margin = [[-1, -1], [2, 1]];

        const all = point.everyRect(margin, (node) => Boolean(count.push(node.join())));

        expect(all).toBeTrue();
        expect(count).toEqual(['-1,-1', '-1,0', '-1,1', '0,-1', '0,0', '0,1', '1,-1', '1,0', '1,1', '2,-1', '2,0', '2,1']);

        count.length = 0;

        const part = point.everyRect(margin, (node) => {
            count.push(node.join());
            return  (node[0] < 0 || node[1] < 0);
        });

        expect(part).toBeFalse();
        expect(count).toEqual(['-1,-1', '-1,0', '-1,1', '0,-1', '0,0']);
    });
    test('Point.prototype.around()', () => {
        let ans: string[];

        const point = new Point(5, -4);
        const distanceLimit = (
            (limit: number) =>
                (node: Point) =>
                    (Math.abs(node[0] - point[0]) + Math.abs(node[1] - point[1]) > limit)
        );

        ans = point.around(distanceLimit(-1), 5).map((node) => node.join());
        expect(ans).toEqual(['5,-4']);

        ans = point.around(distanceLimit(0), 5).map((node) => node.join());
        expect(ans).toEqual(['5,1', '5,-9', '10,-4', '0,-4']);

        ans = point.around(distanceLimit(10), 5).map((node) => node.join());
        expect(ans).toEqual(['5,11', '5,-19', '20,-4', '-10,-4']);

        ans = point.around(distanceLimit(10)).map((node) => node.join());
        expect(ans).toEqual(['5,7', '5,-15', '16,-4', '-6,-4']);
    });
});
