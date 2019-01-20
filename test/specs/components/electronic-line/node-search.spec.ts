import Point from 'src/lib/point';
import { SearchMap, NodeData, SearchStack } from 'src/components/electronic-line/node-search';

describe('electronic-line/node-search.ts', () => {
    test('SearchMap', () => {
        const map = new SearchMap();
        const position = new Point(2, 5);
        const node: NodeData = { position } as any;

        map.set(node);
        expect(map.get(position)).toBe(node);
        expect(map.get(new Point(1, 1))).toBeUndefined();
    });

    describe('SearchStack', () => {
        // 初始节点
        const startNode: NodeData = {
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
