import { Point } from '@circuit/algorithm';
import { ConnectionData } from '@circuit/contracts/painter';

function vectorToKey(vector: Point) {
  if (process.env.NODE_ENV === 'development') {
    if (!vector.isAxis()) {
      throw new Error('连接器向量必须是轴向量');
    }
  }

  // 曼哈顿距离为 20 的向量才是有效的连接器向量
  if (Math.abs(vector[0] + vector[1]) !== 20) {
    return;
  }

  if (vector[0] > 0 && vector[1] === 0) {
    return 'right';
  }
  else if (vector[0] < 0 && vector[1] === 0) {
    return 'left';
  }
  else if (vector[0] === 0 && vector[1] > 0) {
    return 'bottom';
  }
  else if (vector[0] === 0 && vector[1] < 0) {
    return 'top';
  }
}

export function isFull(c: ConnectionData) {
  return Boolean(c.left && c.right && c.top && c.bottom);
}

export function add(current: Point, next: Point, connection: ConnectionData) {
  const key = vectorToKey(next.add(current, -1));
  if (key) {
    connection[key] = true;
  }
}

export function remove(current: Point, next: Point, connection: ConnectionData) {
  const key = vectorToKey(next.add(current, -1));
  if (key) {
    delete connection[key];
  }
}

export function has(current: Point, next: Point, connection: ConnectionData) {
  const key = vectorToKey(next.add(current, -1));
  if (key) {
    return Boolean(connection[key]);
  }

  return false;
}

export function getPoints(connection: ConnectionData) {
  return [
    connection.top ? Point.from([0, -20]) : undefined,
    connection.right ? Point.from([20, 0]) : undefined,
    connection.bottom ? Point.from([0, 20]) : undefined,
    connection.left ? Point.from([-20, 0]) : undefined,
  ];
}
