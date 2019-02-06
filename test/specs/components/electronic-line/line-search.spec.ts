import Point from 'src/lib/point';
import * as Search from 'src/components/electronic-line/line-search';
import { WayMap, LineWay } from 'src/components/electronic-line/line-way';
import { forceUpdateMap } from 'src/lib/map';

describe('electronic-line/line-search.ts', () => {
    let way: LineWay;

    test('两个器件，无导线', () => {
        forceUpdateMap('{"16,9":{"id":"R_1","type":20},"17,9":{"id":"R_1","type":20},"18,9":{"id":"R_1","type":20},"15,9":{"id":"R_1-0","type":21},"19,9":{"id":"R_1-1","type":21},"25,13":{"id":"R_2","type":20},"26,13":{"id":"R_2","type":20},"27,13":{"id":"R_2","type":20},"24,13":{"id":"R_2-0","type":21},"28,13":{"id":"R_2-1","type":21}}');

        const wayMap = new WayMap();
        const mouseOver: Search.DrawSearch.Option['mouseOver'] = {
            status: Search.DrawSearch.Mouse.Idle,
        };

        way = Search.drawSearch({
            start: new Point(19, 9).mul(20),
            end: new Point(407, 175),
            mouseBais: new Point(0, 1),
            direction: new Point(1, 0),
            pointSize: [1, 1],
            wayMap, mouseOver,
        });

        expect(way).toEqual(LineWay.from([[380, 180], [407, 180], [407, 175]]));
    });
});
