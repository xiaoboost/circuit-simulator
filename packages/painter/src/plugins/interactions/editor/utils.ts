import { IPluginInstallerContext } from '@circuit/inject/core/types';
import { HOVER_SERVICE, VARIABLE_OBSERVER_SERVICE } from '../../../types';
import {
  PATH_SEARCH_POINTS_STATE as pathKey,
  PathSearchPointData,
} from '../../interactions/debugger/path-search';
import { SearchHook, PainterState, SearchResult } from './algorithm';
import { POINT_RADIUS_HOC_SCOPE as PinSize } from './constant';

type GetService = IPluginInstallerContext['getService'];

export function painterStateGetter(getService: GetService): PainterState {
  const hoverService = getService(HOVER_SERVICE);

  return {
    getHover() {
      return hoverService.status.data;
    },
  };
}

export function setSearchResult(getService: GetService, result: SearchResult[]): void {
  const VarService = getService(VARIABLE_OBSERVER_SERVICE);

  for (const fixture of result) {
    if ('path' in fixture) {
      VarService.set(pathKey, `${fixture.id}-path`, fixture.path);
      VarService.set(pathKey, `${fixture.id}-pin`, fixture.path);
    }
  }
}

export function createSearchHook(getService: GetService): SearchHook {
  const varService = getService(VARIABLE_OBSERVER_SERVICE);
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
      varService.set(pathKey, { ...store });
    },
    end(path) {
      store!.result = path;
      varService.set(pathKey, { ...store });
    },
    expand(node) {
      store!.expand = [...(store!.expand ?? []), {
        point: node.position,
        value: node.value,
      }];
      varService.set(pathKey, { ...store });
    },
    used(node) {
      store!.current = node.position;
      store!.expand = undefined;
      varService.set(pathKey, { ...store });
    },
    afterEnd() {
      store = undefined;
      varService.set(pathKey, undefined);
    },
  };
}
