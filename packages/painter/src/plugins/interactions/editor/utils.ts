import type { IStateCoreService } from '@circuit/shared';
import type {
  IHoverService,
  IVariableObserverService,
  IConnectionService,
} from '../../../types';
import {
  PATH_SEARCH_POINTS_STATE as DebugKey,
  PathSearchPointData,
} from '../../interactions/debugger/path-search';
import { SearchHook, PainterState, SearchResult } from './algorithm';
import {
  PATH_DISTORTION_HOC_SCOPE as PathKey,
  PIN_STYLE_HOC_SCOPE as PinKey,
} from './constant';

export function painterStateGetter(
  hover: IHoverService,
  state: IStateCoreService,
  connection: IConnectionService,
): PainterState {
  return {
    getHover() {
      return hover.status.data;
    },
    getPart(id) {
      return state.getPart(id);
    },
    getLine(id) {
      return state.getLine(id);
    },
    getConnection(id: string, pin: number) {
      return connection.getConnections(id, pin);
    },
  };
}

export function setSearchResult(
  varService: IVariableObserverService,
  result: SearchResult[],
): void {
  for (const fixture of result) {
    if ('path' in fixture) {
      varService.set(PathKey, `${fixture.id}-path`, fixture.path);
      varService.set(PathKey, `${fixture.id}-pin`, fixture.path);
    }

    if ('pin' in fixture) {
      varService.set(PinKey, `${fixture.id}-${fixture.pin}`, fixture.style);
    }
  }
}

export function createSearchHook(varService: IVariableObserverService): SearchHook {
  let store: PathSearchPointData | undefined = undefined;

  return {
    start(start, end) {
      store = {
        start,
        end,
        current: undefined,
        expand: undefined,
        result: undefined,
      };
      varService.set(DebugKey, { ...store });
    },
    end(path) {
      store!.result = path;
      varService.set(DebugKey, { ...store });
    },
    expand(node) {
      store!.expand = [...(store!.expand ?? []), {
        point: node.position,
        value: node.value,
      }];
      varService.set(DebugKey, { ...store });
    },
    used(node) {
      store!.current = node.position;
      store!.expand = undefined;
      varService.set(DebugKey, { ...store });
    },
    afterEnd() {
      store = undefined;
      varService.set(DebugKey, undefined);
    },
  };
}
