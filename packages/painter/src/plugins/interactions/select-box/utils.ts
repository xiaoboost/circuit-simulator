import { Point } from '@circuit/algorithm';
import { isLineId } from '@circuit/electronics';
import type { IConnectionData, IConnectionService } from '../../../types';

export function toPath(start: Point, end: Point) {
  const [left, top] = start;
  const [right, bottom] = end;
  return `M${left},${top}L${right},${top}L${right},${bottom}L${left},${bottom}Z`;
}

/**
 * 标记可移动的导线
 * @param parts 选中的器件ID列表
 * @param connection 连接服务
 * @returns 需要移动的器件ID列表
 */
export function markMovableLines(
  parts: string[],
  connection: IConnectionService,
): string[] {
  const movable = new Set<string>();
  const halfMovable = new Set<string>();

  // 广度优先搜索，标记所有需要移动的器件
  function DFS(id: string) {
    // 已经确定整体移动的器件
    if (movable.has(id)) {
      return;
    }

    // 标记导线
    if (isLineId(id)) {
      // 访问过
      if (halfMovable.has(id)) {
        movable.add(id);
        halfMovable.delete(id);
        return;
      }

      // 初次访问
      halfMovable.add(id);

      const startConnection = connection.getConnections(id, 0);
      const endConnection = connection.getConnections(id, 1);
      const hasConnection = ({ id }: IConnectionData) => {
        return movable.has(id) || halfMovable.has(id);
      };

      // 导线两侧均有被选中导线，则当前导线也可移动
      if (
        startConnection.some(hasConnection)
        && endConnection.some(hasConnection)
      ) {
        movable.add(id);

        for (const { id: connectionId } of [...startConnection, ...endConnection]) {
          DFS(connectionId);
        }
      }
    }
    // 标记器件
    else {
      movable.add(id);

      for (const { id: connectionId } of connection.getConnections(id)) {
        DFS(connectionId);
      }
    }
  }

  for (const id of parts) {
    DFS(id);
  }

  return Array.from(movable).filter(isLineId);
}
