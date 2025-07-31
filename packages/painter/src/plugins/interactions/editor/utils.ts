import { IPluginInstallerContext } from '@circuit/inject';
import { LOGGER_SERVICE } from '@circuit/shared';
import { HOVER_SERVICE, VARIABLE_OBSERVER_SERVICE } from '../../../types';
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
  // ..
}

export function createSearchHook(getService: GetService): SearchHook {
  const loggerService = getService(LOGGER_SERVICE);

  return {
    useCurrentNode(node) {
      // ..
    },
    useExpandNode(node) {
      // ..
    },
    useStartNode(node) {
      // ..
    },
    useEndNode(node) {
      // ..
    },
    useEndSearch(path) {
      // ..
    },
  };
}
