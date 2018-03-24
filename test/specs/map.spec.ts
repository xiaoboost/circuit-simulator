import '../extend';
import 'src/lib/native';

import { $P, Point } from 'src/lib/point';
import * as map from 'src/lib/map';

describe('map.ts: Data marked by drawings', () => {
    afterEach(() => map.forceUpdateMap());

    test('getPoint/setPoint()', () => {
        expect(map.getPoint([1, 2])).toBeUndefined();

        const data = {
            id: 'r_1',
            type: 'part',
            point: $P(1, 3),
            connect: [$P(1, 4), $P(2, 3)],
        };

        map.setPoint(data);
        expect(map.getPoint([1, 3])).toEqual(data);

        data.point = $P(40, 60);
        map.setPoint(data, true);
        expect(map.getPoint([40, 60], true)).toEqual(data);
    });
    test('outputMap/forceUpdateMap()', () => {
        expect(map.outputMap()).toEqual('{}');

        const data = {
            id: 'r_2',
            type: 'part',
            point: $P(1, 3),
            connect: [$P(1, 4), $P(2, 3)],
        };

        let dataString = JSON.stringify(data);

        map.setPoint(data);
        expect(map.outputMap()).toEqual(`{"1,3":${dataString}}`);

        dataString = dataString.replace(/}$/, ',"test":123}');
        dataString = `{"1,3":${dataString}}`;

        map.forceUpdateMap(dataString);
        expect(map.getPoint([1, 3])).toEqual(data);

        map.forceUpdateMap(dataString, true);
    });
    test('mergePoint()', () => {
        const originData = {
            id: 'r_2',
            type: 'part',
            point: $P(1, 3),
            connect: [$P(1, 4), $P(2, 3)],
        };

        map.mergePoint(originData);

        const mapData = map.getPoint([1, 3])!;
        expect(mapData).toEqual(originData);

        originData.id = 'r_1';
        originData.type = 'line';
        originData.point = $P(20, 60);
        originData.connect.push($P(1, 4), $P(5, 5));
        expect(map.getPoint([1, 3])).toEqual(mapData);

        map.mergePoint(originData, true);
        originData.connect = [$P(1, 4), $P(2, 3), $P(5, 5)];
        expect(map.getPoint([20, 60], true)).toEqual(originData);
    });
    test('hasPoint/deletePoint()', () => {
        const data = { id: '1', type: '2', point: $P(2, 3) };

        expect(map.hasPoint([2, 3])).toBeFalse();
        expect(map.hasPoint([40, 60], true)).toBeFalse();

        map.setPoint(data);
        expect(map.hasPoint([2, 3])).toBeTrue();
        expect(map.hasPoint([40, 60], true)).toBeTrue();

        map.deletePoint([2, 3]);
        expect(map.hasPoint([2, 3])).toBeFalse();

        map.setPoint(data);
        map.deletePoint([40, 60], true);
        expect(map.hasPoint([2, 3])).toBeFalse();
    });
    test('hasConnect/addConnect/deleteConnect()', () => {
        const data = {
            id: 'R_1',
            type: 'line',
            point: $P(1, 3),
            connect: undefined as (undefined | Point[]),
        };

        expect(() => map.hasConnect([1, 3], [1, 2])).toThrowError('(map) space point.');
        expect(() => map.addConnect([1, 3], [1, 2])).toThrowError('(map) space point.');
        expect(() => map.deleteConnect([1, 3], [1, 2])).toThrowError('(map) space point.');

        map.setPoint(data);

        expect(() => map.hasConnect([1, 3], [1, 2])).toThrowError('(map) this point do not have connect.');
        expect(() => map.addConnect([1, 3], [1, 2])).toThrowError('(map) this point do not have connect.');
        expect(() => map.deleteConnect([1, 3], [1, 2])).toThrowError('(map) this point do not have connect.');

        data.connect = [];
        map.mergePoint(data);
        expect(map.hasConnect([1, 3], [2, 3])).toBeFalse();

        map.addConnect([1, 3], [2, 3]);
        map.addConnect([1, 3], [2, 3]);
        expect(map.hasConnect([1, 3], [2, 3])).toBeTrue();

        map.deleteConnect([1, 3], [2, 3]);
        expect(map.hasConnect([1, 3], [2, 3])).toBeFalse();

        map.addConnect([20, 60], [40, 60], true);
        expect(map.hasConnect([20, 60], [40, 60], true)).toBeTrue();

        map.deleteConnect([20, 60], [40, 60], true);
        expect(map.hasConnect([20, 60], [40, 60], true)).toBeFalse();
    });
    test('isLine()', () => {
        map.setPoint({
            id: 't',
            type: 'part',
            point: $P(1, 3),
        });

        expect(map.isLine([1, 3])).toBeFalse();

        map.setPoint({
            id: 't',
            type: 'line',
            point: $P(1, 3),
        });

        expect(map.isLine([1, 3])).toBeTrue();

        map.setPoint({
            id: 't',
            type: 'line-point',
            point: $P(1, 3),
        });

        expect(map.isLine([1, 3])).toBeTrue();

        map.setPoint({
            id: 't',
            type: 'cross-point',
            point: $P(1, 3),
        });

        expect(map.isLine([20, 60], true)).toBeTrue();
    });
    test('alongTheLine()', () => {
        // [4, 2] -> [8, 2]
        for (let i = 4; i < 9; i++) {
            const data: map.MapPointData = {
                type: 'line',
                point: $P(i, 2),
                id: 'line_1',
            };

            if (i === 4) {
                data.connect = [$P(5, 2)];
            }
            else if (i === 8) {
                data.connect = [$P(7, 2)];
            }
            else {
                data.connect = [$P(i - 1, 2), $P(i + 1, 2)];
            }

            map.setPoint(data);
        }
        // [9, 2] -> [12, 2]
        for (let i = 9; i < 13; i++) {
            const data: map.MapPointData = {
                type: 'line',
                point: $P(i, 2),
                id: 'line_1',
            };

            if (i === 9) {
                data.connect = [$P(10, 2)];
            }
            else if (i === 12) {
                data.connect = [$P(11, 2)];
            }
            else {
                data.connect = [$P(i - 1, 2), $P(i + 1, 2)];
            }

            map.setPoint(data);
        }

        // 起点不是导线，输出起点
        expect(map.alongTheLine([4, 4])).toEqual($P(4, 4));
        // 起点和终点相等，输出起点
        expect(map.alongTheLine([4, 2], [4, 2])).toEqual($P(4, 2));

        // 起点和终点在线段内
        expect(map.alongTheLine([4, 2], [7, 2])).toEqual($P(7, 2));
        // 终点在线段外
        expect(map.alongTheLine([4, 2], [14, 2])).toEqual($P(8, 2));

        // 指定特定方向
        expect(map.alongTheLine([6, 2], [14, 2], [-1, 0])).toEqual($P(4, 2));

        // 大图标
        expect(map.alongTheLine([80, 40], [280, 40], undefined, true)).toEqual($P(160, 40));
    });
});
