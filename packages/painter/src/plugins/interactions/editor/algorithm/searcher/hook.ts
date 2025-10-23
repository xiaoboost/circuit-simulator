import type { IVariableObserverService } from '../../../../../types';
import {
  PATH_SEARCH_POINTS_STATE as DebugKey,
  PathSearchPointData,
} from '../../../../interactions/debugger/path-search';
import type { SearchHook } from '../a-star';

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
      store!.expand = [
        ...(store!.expand ?? []),
        {
          point: node.position,
          value: node.value,
        },
      ];
      varService.set(DebugKey, { ...store });
    },
    used(node) {
      store!.current = node.position;
      varService.set(DebugKey, { ...store });
    },
    afterEnd() {
      store = undefined;
      varService.set(DebugKey, undefined);
    },
  };
}
