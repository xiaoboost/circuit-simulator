import { useService, useWatcher } from '../../../context';
import { ICursorKind, ICursorService } from '../../../types';

import IconDrawLine from '../assets/draw-line.svg';
import IconSelectBox from '../assets/select-box.svg';

function getCursorStyle(cursor: ICursorKind): React.CSSProperties {
  switch (cursor) {
    case ICursorKind.Default:
      return {
        cursor: 'default',
      };
    case ICursorKind.NotAllowed:
      return {
        cursor: 'not-allowed',
      };
    case ICursorKind.Crosshair:
      return {
        cursor: 'crosshair',
      };
    case ICursorKind.Drag:
      return {
        cursor: 'grab',
      };
    case ICursorKind.Dragging:
      return {
        cursor: 'grabbing',
      };
    case ICursorKind.ResizeEW:
      return {
        cursor: 'ew-resize',
      };
    case ICursorKind.ResizeNS:
      return {
        cursor: 'ns-resize',
      };
    case ICursorKind.DrawLine:
      return {
        cursor: `url(${IconDrawLine}) 16 16, default`,
      };
    case ICursorKind.SelectBox:
      return {
        cursor: `url(${IconSelectBox}) 12 12, default`,
      };
    default:
      return {};
  }
}

export function useCursorStyle() {
  const cursorService = useService(ICursorService);
  const [cursor] = useWatcher(cursorService.value);
  return getCursorStyle(cursor);
}
