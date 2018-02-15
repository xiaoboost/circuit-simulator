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
        expect(map.getPoint([1, 3])).toEqualObject(data);

        data.point = $P(40, 60);
        map.setPoint(data, true);
        expect(map.getPoint([40, 60], true)).toEqualObject(data);
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
        expect(map.getPoint([1, 3])).toEqualObject(data);

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
        expect(mapData).toEqualObject(originData);

        originData.id = 'r_1';
        originData.type = 'line';
        originData.point = $P(20, 60);
        originData.connect.push($P(1, 4), $P(5, 5));
        expect(map.getPoint([1, 3])).toEqualObject(mapData);

        map.mergePoint(originData, true);
        originData.connect = [$P(1, 4), $P(2, 3), $P(5, 5)];
        expect(map.getPoint([20, 60], true)).toEqualObject(originData);
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
            type: 'cross-point',
            point: $P(1, 3),
        });

        expect(map.isLine([20, 60], true)).toBeTrue();
    });
});
