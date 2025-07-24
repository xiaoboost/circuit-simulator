import { IPluginInstallerContext } from '@circuit/inject';
import { LOGGER_SERVICE } from '@circuit/shared';
import { HOVER_SERVICE, VARIABLE_OBSERVER_SERVICE } from '../../../types';
import { SearchHook, PainterController } from './algorithm';
import { POINT_RADIUS_HOC_SCOPE as PinSize } from './constant';

type GetService = IPluginInstallerContext['getService'];

export function createPainterController(getService: GetService): PainterController {
  const hoverService = getService(HOVER_SERVICE);
  const VarService = getService(VARIABLE_OBSERVER_SERVICE);

  return {
    getHover() {
      return hoverService.status.data;
    },
    setPinSize(id, pin, size) {
      VarService.set(PinSize, `${id}-${pin}`, size);
    },
    clearPinSize(id, pin) {
      VarService.set(PinSize, `${id}-${pin}`, undefined);
    },
  };
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
