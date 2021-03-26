import Point from 'src/lib/point';
import Matrix from 'src/lib/matrix';

import * as Map from 'src/lib/map';

import { LineWay, Draw } from 'src/components/electronic-line/search';
import { SearchMap, NodeData as SearchNodeData, SearchStack } from 'src/components/electronic-line/search/node-search';

import { default as PartComponent, Electronics, PartType } from 'src/components/electronic-part';

type MockPart = Writeable<Pick<PartComponent, 'id' | 'type' | 'points' | 'position' | 'connect' | 'pointSize' | 'margin'>>;
type MockPartInput = Pick<PartComponent, 'type'> & Partial<Omit<MockPart, 'type'>>;
type MapUpdateData = AnyObject<Map.NodeUpdateData>;

/** 生成虚拟器件组件 */
function mockPartComponent(prop: MockPartInput) {
  const options = (PartComponent as any).options;
  const markSign = (part: MockPart): void => options.methods.markSign.call(part);
  const getMargin = (part: MockPart): PartComponent['margin'] => options.computed.margin.get.call(part);
  const getPoints = (part: MockPart): PartComponent['points'] => options.computed.points.get.call(part);

  const data = {
    position: new Point(100, 100),
    connect: [],
    pointSize: [-1, -1],
    rotate: Matrix.from([[1, 0], [0, 1]]),
    origin: Electronics[prop.type],
    ...prop,
  } as MockPart;

  data.points = getPoints(data);
  data.margin = getMargin(data);

  markSign(data);

  return data as PartComponent;
}

describe('electronic-line 导线组件测试', () => {
  describe('node-search 节点搜索测试', () => {
    test('SearchMap 搜索图测试', () => {
      const map = new SearchMap();
      const position = new Point(2, 5);
      const node: SearchNodeData = { position } as any;

      map.set(node);
      expect(map.get(position)).toBe(node);
      expect(map.get(new Point(1, 1))).toBeUndefined();
    });

    describe('SearchStack 搜索堆栈测试', () => {
      // 初始节点
      const startNode: SearchNodeData = {
        position: new Point(1, 5),
        direction: new Point(1, 0),
        junction: 0,
        value: 4,
        cornerParent: undefined as any,
      };

      test('shift 方法只会弹出当前估值最小的数据', () => {
        const stack = new SearchStack();
        const node1 = {
          ...startNode,
          position: new Point(2, 5),
          value: 5,
        };
        const node2 = {
          ...startNode,
          position: new Point(3, 5),
          value: 2,
        };
        const node3 = {
          ...startNode,
          position: new Point(4, 5),
          value: 1,
        };

        stack.push(startNode);
        stack.push(node1);
        stack.push(node2);
        stack.push(node3);

        expect(stack.shift()).toBe(node3);
        expect(stack.shift()).toBe(node2);
        expect(stack.shift()).toBe(startNode);
        expect(stack.shift()).toBe(node1);
        expect(stack.shift()).toBeUndefined();
      });

      test('相同估值，会弹出最早压栈的节点', () => {
        const stack = new SearchStack();
        const node = {
          ...startNode,
          position: new Point(2, 5),
        };

        stack.push(node);
        stack.push(startNode);

        expect(stack.shift()).toBe(node);
        expect(stack.shift()).toBe(startNode);
        expect(stack.shift()).toBeUndefined();
      });

      test('相同位置，只会保留估值小的', () => {
        const stack1 = new SearchStack();
        const node1 = {
          ...startNode,
          value: 5,
        };

        stack1.push(startNode);
        stack1.push(node1);

        // 保留前者
        expect(stack1.shift()).toBe(startNode);
        expect(stack1.shift()).toBeUndefined();

        const stack2 = new SearchStack();
        const node2 = {
          ...startNode,
          value: 3,
        };

        stack2.push(startNode);
        stack2.push(node2);

        // 保留后者
        expect(stack2.shift()).toBe(node2);
        expect(stack1.shift()).toBeUndefined();
      });

      test('已经处理过的重复节点不会再次进入搜索堆栈', () => {
        const stack = new SearchStack();
        const node1 = {
          ...startNode,
          value: 5,
        };
        const node2 = {
          ...startNode,
          value: 3,
        };

        stack.push(startNode);
        stack.push(node1);

        stack.shift();
        stack.shift();

        /**
         * 由于搜索图中的数据会保留下来，所以对于 startNode 这个节点，
         * 虽然它已经弹出了，但是因为它在搜索图中还存在着所以这里这个节点实际上是会被放弃掉的
         */
        stack.push(startNode);
        stack.push(node2);

        expect(stack.shift()).toBe(node2);
        expect(stack.shift()).toBeUndefined();
      });
    });
  });
  describe('line-search 导线搜索测试', () => {
    let way: LineWay;

    describe('两个器件', () => {
      /** 虚拟器件 1 */
      const part1 = mockPartComponent({
        id: 'R_1',
        position: new Point(11, 10).mul(20),
        type: PartType.Resistance,
      });

      /** 虚拟器件 2 */
      const part2 = mockPartComponent({
        id: 'R_2',
        position: new Point(25, 25).mul(20),
        type: PartType.Resistance,
      });

      const partPosition = part1.position;
      const start = partPosition.add(part1.points[1].position);
      const direction = part1.points[1].direction;
      const cache = new Draw.Cache(start, direction);

      /** 默认搜索参数 */
      const searchOption: Draw.Option = {
        start,
        cache,
        direction,
        end: new Point(407, 275),
        mouseBais: new Point(0, 1),
        pointSize: [1, 1],
        mouseOver: {
          status: Draw.Mouse.Idle,
        },
      };

      test('器件右侧节点为起点，鼠标至空白处', () => {
        way = Draw.search({
          ...searchOption,
          end: new Point(407, 275),
        });

        expect(way).toEqual(LineWay.from([start, [407, 200], [407, 275]]));
      });

      test('器件右侧节点为起点，鼠标至器件上，偏上方', () => {
        way = Draw.search({
          ...searchOption,
          end: partPosition.add([-5, -5]),
          mouseOver: {
            status: Draw.Mouse.Part,
            part: part1,
          },
        });

        expect(way).toEqual(LineWay.from([start, start.add([0, -20]), start.add([-80, -20]), start.add([-80, 0])]));
      });

      test('器件右侧节点为起点，鼠标至器件上，偏下方', () => {
        way = Draw.search({
          ...searchOption,
          end: partPosition.add([-5, 5]),
          mouseOver: {
            status: Draw.Mouse.Part,
            part: part1,
          },
        });

        expect(way).toEqual(LineWay.from([start, start.add([0, 20]), start.add([-80, 20]), start.add([-80, 0])]));
      });
    });

    // describe('两个器件', () => {

    // });
  });
});
