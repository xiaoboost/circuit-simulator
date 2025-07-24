import { IPluginInstallerContext } from '@circuit/inject';
import { LOGGER_SERVICE } from '@circuit/shared';
import { HOVER_SERVICE } from '../../../types';
import { SearchHook, PainterController } from './algorithm';

type GetService = IPluginInstallerContext['getService'];

export function createPainterController(getService: GetService): PainterController {
  const hoverService = getService(HOVER_SERVICE);

  return {
    getHover() {
      return hoverService.status.data;
    },
    setPinSize(id, pin, size) {
      // hoverService.setPinSize(id, pin, size);
    },
    clearPinSize(id, pin) {
      // hoverService.clearPinSize(id, pin);
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
