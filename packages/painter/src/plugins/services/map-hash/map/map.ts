import { Point } from '@circuit/algorithm';
import { Mark, MarkMap } from '../../../../types';

function toKey(node: Point) {
  if (process.env.NODE_ENV === 'development') {
    if ((node[0] % 20 !== 0) || (node[1] % 20 !== 0)) {
      throw new Error(`节点数值必须是 20 的整数：[${node.join(', ')}]`);
    }
  }

  return `${node[0]},${node[1]}`;
}

function toPoint(key: string) {
  const node = Point.from(key.split(',').map(Number));

  if (process.env.NODE_ENV === 'development') {
    if ((node[0] % 20 !== 0) || (node[1] % 20 !== 0)) {
      throw new Error(`节点数值必须是 20 的整数：[${node.join(', ')}]`);
    }
  }

  return node;
}

function getPoints(map: MarkMap) {
  return Array.from(map.keys())
    .map((key: string) => toPoint(key))
    .sort((pre, next) => {
      if (pre[0] < next[0]) {
        return -1;
      }
      else if (pre[0] === next[0]) {
        return pre[1] < next[1] ? -1 : 1;
      }
      else {
        return 1;
      }
    });
}

export function has(map: MarkMap, node: Point) {
  return map.has(toKey(node));
}

export function set(map: MarkMap, data: Mark) {
  map.set(toKey(data.position), data);
}

export function get<T extends Mark = Mark>(map: MarkMap, node: Point): T | undefined {
  return map.get(toKey(node)) as T | undefined;
}

export function remove(map: MarkMap, node: Point) {
  map.delete(toKey(node));
}

export function values(map: MarkMap) {
  return getPoints(map)
    .map((point) => get(map, point) as Mark);
}
