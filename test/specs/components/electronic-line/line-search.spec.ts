import Point from 'src/lib/point';
import * as Search from 'src/components/electronic-line/line-search';
import { WayMap, LineWay } from 'src/components/electronic-line/line-way';
import { forceUpdateMap } from 'src/lib/map';

import PartComponent from 'src/components/electronic-part';
// import LineComponent from 'src/components/electronic-line/component';

import { default as Parts , PartType } from 'src/components/electronic-part/parts';

type MockPart = Pick<PartComponent, 'type' | 'points' | 'position' | 'connect' | 'pointSize'>;
type MockPartInput = Pick<PartComponent, 'type'> & Partial<Omit<MockPart, 'type'>>;

/** 生成虚拟器件组件 */
function mockPartComponent(prop: MockPartInput) {
    const data: MockPart = {
        position: new Point(100, 100),
        connect: [],
        pointSize: [-1, -1],
        points: Parts[prop.type].points.map(({ direction, position }) => ({
            size: -1,
            class: 'part-point-open' as 'part-point-open',
            direction: Point.from(direction),
            position: Point.from(position),
            originPosition: Point.from(position),
        })),
        ...prop,
    };

    return data as PartComponent;
}

describe('electronic-line/line-search.ts', () => {
    let way: LineWay;

    describe('单个器件', () => {
        forceUpdateMap('{"10,10":{"id":"R_1","type":20},"11,10":{"id":"R_1","type":20},"12,10":{"id":"R_1","type":20},"9,10":{"id":"R_1-0","type":21},"13,10":{"id":"R_1-1","type":21}}');

        const wayMap = new WayMap();
        const partPosition = new Point(11, 10).mul(20);
        const part = mockPartComponent({
            position: partPosition,
            type: PartType.Resistance,
            connect: ['', 'line_1'],
        });
        const start = partPosition.add(part.points[1].position);
        const direction = part.points[1].direction;

        test('器件右侧节点为起点，鼠标至空白处', () => {
            way = Search.drawSearch({
                start,
                wayMap,
                direction,
                end: new Point(407, 275),
                mouseBais: new Point(0, 1),
                pointSize: [1, 1],
                mouseOver: {
                    status: Search.DrawSearch.Mouse.Idle,
                },
            });

            expect(way).toEqual(LineWay.from([start, [407, 200], [407, 275]]));
        });

        test('器件右侧节点为起点，鼠标至器件上，偏上方', () => {
            way = Search.drawSearch({
                start,
                wayMap,
                direction,
                end: partPosition.add([-5, -5]),
                mouseBais: new Point(0, 1),
                pointSize: [1, 1],
                mouseOver: {
                    status: Search.DrawSearch.Mouse.Part,
                    part,
                },
            });

            expect(way).toEqual(LineWay.from([start, start.add([0, -20]), start.add([-80, -20]), start.add([-80, 0])]));
        });

        test('器件右侧节点为起点，鼠标至器件上，偏下方', () => {
            way = Search.drawSearch({
                start,
                wayMap,
                direction,
                end: partPosition.add([-5, 5]),
                mouseBais: new Point(0, 1),
                pointSize: [1, 1],
                mouseOver: {
                    status: Search.DrawSearch.Mouse.Part,
                    part,
                },
            });

            expect(way).toEqual(LineWay.from([start, start.add([0, 20]), start.add([-80, 20]), start.add([-80, 0])]));
        });
    });
});
