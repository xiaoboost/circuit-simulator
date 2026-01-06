import type { Point } from '@circuit/algorithm';
import type { IStateCoreService } from '@circuit/contracts/global';
import type {
  IHoverService,
  IConnectionService,
  IMapHashService,
  Mark,
} from '@circuit/contracts/painter';
import type { IPainterAdapter } from './types';

export interface IPainterAdapterOptions {
  /** 忽略的元件 */
  ignoreSet?: Set<string>;
  /** 鼠标覆盖状态 */
  hover: IHoverService;
  /** 画布数据服务 */
  state: IStateCoreService;
  /** 连接服务 */
  connection: IConnectionService;
  /** MapHash 服务 */
  mapHash: IMapHashService;
}

export function getPainterAdapter({
  ignoreSet = new Set(),
  hover,
  state,
  connection,
  mapHash,
}: IPainterAdapterOptions): IPainterAdapter {
  const hasIgnoreId = (
    ignoreSet.size > 0
    && Array.from(ignoreSet).some((id) => Boolean(state.getElectronic(id)))
  );
  const forkMapHash = hasIgnoreId ? mapHash.clone() : mapHash;

  for (const id of ignoreSet) {
    forkMapHash.removeMark(state.getElectronic(id));
  }

  return {
    assert: forkMapHash,
    mark: forkMapHash,

    getMarkAt(position: Point): Mark | undefined {
      return forkMapHash.get(position);
    },
    hasMarkAt(position: Point): boolean {
      return forkMapHash.has(position);
    },
    getHover() {
      const stack = hover.getStackAt();

      if (stack.length === 0) {
        return;
      }

      const filteredStack = stack.filter((entity) => !ignoreSet.has(entity.id));

      if (filteredStack.length > 0) {
        return filteredStack[0];
      }
    },
    getPart(id: string) {
      return state.getPart(id);
    },
    getLine(id: string) {
      return state.getLine(id);
    },
    getConnection(id: string, pin: number) {
      return connection
        .getConnections(id, pin)
        .filter((connection) => !ignoreSet.has(connection.id));
    },
  };
}
