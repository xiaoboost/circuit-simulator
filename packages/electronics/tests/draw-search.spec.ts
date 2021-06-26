import test from 'ava';

import { Point } from '@circuit/math';
import { DrawPathSearcher } from '../src';
import { loadData, loadSpace, createContext } from './utils';

test('终点为空白', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const bias = new Point(0, 0);
  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);

  let path = searcher.search(new Point(150, 110), bias);

  deepEqual(path.toData(), [
    [140, 100],
    [150, 100],
    [150, 110],
  ]);

  path = searcher.search(Point.from([500, 400]), bias);

  deepEqual(path.toData(), [
    [140, 100],
    [500, 100],
    [500, 400],
  ]);
});

/**
 * xxxxx --------┐
 *         xxxxx |
 *            ---┘
 */
test('终点为空白，有器件挡道', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [300, 300],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);
  const path = searcher.search(Point.from([310, 360]));

  deepEqual(path.toData(), [
    [140, 100],
    [360, 100],
    [360, 360],
    [310, 360],
  ]);
});

/**
 * xxxxx┐
 *      |
 * xxxxx|
 *      ┘
 */
test('两个器件，器件在同一列，终点在下面器件右边引脚的右下角', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [100, 300],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);
  const path = searcher.search(Point.from([150, 310]));

  deepEqual(path.toData(), [
    [140, 100],
    [160, 100],
    [160, 310],
    [150, 310],
  ]);
});

test('引脚所在，且和出线方向相反的位置', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);

  // 右引脚右下角
  deepEqual(searcher.search(Point.from([130, 110])).toData(), [
    [140, 100],
    [140, 110],
    [130, 110],
  ]);

  // 右引脚右上角
  deepEqual(searcher.search(Point.from([130, 90])).toData(), [
    [140, 100],
    [140, 90],
    [130, 90],
  ]);
});

test('出线方向相反的位置', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);

  loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);

  // 器件中部往下
  deepEqual(searcher.search(Point.from([100, 110])).toData(), [
    [140, 100],
    [140, 120],
    [100, 120],
    [100, 110],
  ]);

  // 器件中部往上
  deepEqual(searcher.search(Point.from([100, 90])).toData(), [
    [140, 100],
    [140, 80],
    [100, 80],
    [100, 90],
  ]);

  // 远离器件往下
  deepEqual(searcher.search(Point.from([40, 110])).toData(), [
    [140, 100],
    [140, 120],
    [40, 120],
    [40, 110],
  ]);

  // 远离器件往上
  deepEqual(searcher.search(Point.from([40, 90])).toData(), [
    [140, 100],
    [140, 80],
    [40, 80],
    [40, 90],
  ]);
});

test('终点为器件，器件有空置引脚', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);
  const { parts } = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [300, 300],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);

  let path = searcher.search(Point.from([200, 150]));

  deepEqual(path.toData(), [
    [140, 100],
    [200, 100],
    [200, 150],
  ]);

  searcher.setMouseOver(parts[1]);

  path = searcher.search(Point.from([310, 300]));

  deepEqual(path.toData(), [
    [140, 100],
    [340, 100],
    [340, 300],
  ]);

  path = searcher.search(Point.from([290, 300]));

  deepEqual(path.toData(), [
    [140, 100],
    [260, 100],
    [260, 300],
  ]);

  path = searcher.search(Point.from([300, 300]), Point.from([1, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [340, 100],
    [340, 300],
  ]);

  searcher.freeMouse();

  path = searcher.search(Point.from([380, 300]), Point.from([1, 0]));

  deepEqual(path.toData(), [
    [140, 100],
    [380, 100],
    [380, 300],
  ]);
});

test('终点为器件，器件没有空置引脚', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 100);
  const { parts } = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [300, 300],
    },
  ], context);

  const { lines } = loadSpace([
    {
      kind: 'Line',
      path: [[140, 100]],
    }
  ], context);

  const searcher = new DrawPathSearcher(start, new Point(1, 0), lines[0]);

  parts[1].connections[0].add('test', 0);
  parts[1].connections[1].add('test', 0);

  searcher.setMouseOver(parts[1]);

  /**
   * 器件右半靠上的坐标，这里只有三个节点
   */

  let path = searcher.search(Point.from([310, 290]));

  deepEqual(path.toData(), [
    [140, 100],
    [310, 100],
    [310, 290],
  ]);

  /**
   * 器件右半靠下的坐标，路径会在这里绕一下，所以有4个节点
   */

  path = searcher.search(Point.from([310, 310]));

  deepEqual(path.toData(), [
    [140, 100],
    [360, 100],
    [360, 310],
    [310, 310],
  ]);
});

/**
 * xxxxx-┐
 *       |---xxxxx
 * xxxxx-┘
 */
test('终点为导线，当前导线是直线，且不会跟随鼠标', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(300, 160);
  const data = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [100, 320],
    },
    {
      id: 'R_3',
      kind: 'Resistance',
      position: [340, 160],
    },
    {
      kind: 'Line',
      path: [[140, 100], [140, 320]],
    },
  ], context);

  const space = loadSpace([
    {
      kind: 'Line',
      path: [start.toData()],
    }
  ], context);

  const line1 = data.lines[0];
  const line2 = space.lines[0];
  const searcher = new DrawPathSearcher(start, new Point(-1, 0), line2);

  searcher.setMouseOver(line1);

  deepEqual(searcher.search(Point.from([145, 160])).toData(), [
    [300, 160],
    [140, 160],
  ]);

  deepEqual(searcher.search(Point.from([135, 200])).toData(), [
    [300, 160],
    [140, 160],
  ]);

  deepEqual(searcher.search(Point.from([135, 280])).toData(), [
    [300, 160],
    [140, 160],
  ]);

  deepEqual(searcher.search(Point.from([140, 160])).toData(), [
    [300, 160],
    [140, 160],
  ]);
});

/**
 * xxxxx---┐
 * xxxxx------xxxxx
 */
test('终点为导线，当前导线是曲线，跟随鼠标', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(140, 180);
  const data = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [100, 180],
    },
    {
      id: 'R_3',
      kind: 'Resistance',
      position: [300, 100],
    },
    {
      kind: 'Line',
      path: [[140, 100], [260, 100]],
    },
  ], context);

  const space = loadSpace([
    {
      kind: 'Line',
      path: [start.toData()],
    }
  ], context);

  const line1 = data.lines[0];
  const line2 = space.lines[0];
  const searcher = new DrawPathSearcher(start, new Point(1, 0), line2);

  searcher.setMouseOver(line1);

  deepEqual(searcher.search(Point.from([215, 105])).toData(), [
    [140, 180],
    [215, 180],
    [215, 100],
  ]);

  deepEqual(searcher.search(Point.from([180, 95])).toData(), [
    [140, 180],
    [180, 180],
    [180, 100],
  ]);
});

/**
 * xxxxx---┐
 *          ---xxxxx
 */
test('终点是空置导线节点', ({ deepEqual }) => {
  const context = createContext();
  const start = new Point(260, 140);
  const data = loadData([
    {
      id: 'R_1',
      kind: 'Resistance',
      position: [100, 100],
    },
    {
      id: 'R_2',
      kind: 'Resistance',
      position: [300, 140],
    },
    {
      kind: 'Line',
      path: [[140, 100], [200, 100], [200, 120]],
    },
  ], context);

  const space = loadSpace([
    {
      kind: 'Line',
      path: [start.toData()],
    }
  ], context);

  const line1 = data.lines[0];
  const line2 = space.lines[0];
  const searcher = new DrawPathSearcher(start, new Point(-1, 0), line2);

  searcher.setMouseOver(line1);

  deepEqual(searcher.search(new Point(202, 115)).toData(), [
    [260, 140],
    [200, 140],
    [200, 120],
  ]);
});
