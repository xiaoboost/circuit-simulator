import type { Point } from '@circuit/algorithm';
import type { IStateCoreService } from '@circuit/shared';
import type {
  IHoverService,
  IConnectionService,
  IMapHashService,
  Mark,
} from '../../../../../types';
import type { IPainterAdapter } from './types';

export interface IPainterAdapterOptions {
  /** 忽略的元件 */
  ignoreIds?: Set<string>;
  /** 鼠标覆盖状态 */
  hoverService: IHoverService;
  /** 画布状态 */
  stateCoreService: IStateCoreService;
  /** 连接服务 */
  connectionService: IConnectionService;
  /** MapHash 服务 */
  mapHashService: IMapHashService;
}

export function getPainterAdapter({
  ignoreIds = new Set(),
  hoverService: hover,
  stateCoreService: state,
  connectionService: connection,
  mapHashService: map,
}: IPainterAdapterOptions): IPainterAdapter {
  const forkMapHash = map.clone();

  for (const id of ignoreIds) {
    forkMapHash.removeMark(state.getElectronic(id));
  }

  return {
    assert: map,
    mark: map,

    getMarkAt(position: Point): Mark | undefined {
      return map.get(position);
    },
    hasMarkAt(position: Point): boolean {
      return map.has(position);
    },
    getHover() {
      const stack = hover.getStackAt();

      if (stack.length === 0) {
        return;
      }

      const filteredStack = stack.filter((entity) => !ignoreIds.has(entity.id));

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
        .filter((connection) => !ignoreIds.has(connection.id));
    },
  };
}
