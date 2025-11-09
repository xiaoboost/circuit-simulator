import { useService, useWatcher } from '../../../context';
import { CursorKind, ICursorService } from '../../../types';

import IconDrawLine from '../assets/draw-line.svg';
import IconSelectBox from '../assets/select-box.svg';

function getCursorStyle(cursor: CursorKind): React.CSSProperties {
  switch (cursor) {
    case CursorKind.Default:
      return {
        cursor: 'default',
      };
    case CursorKind.NotAllowed:
      return {
        cursor: 'not-allowed',
      };
    case CursorKind.Crosshair:
      return {
        cursor: 'crosshair',
      };
    case CursorKind.Drag:
      return {
        cursor: 'grab',
      };
    case CursorKind.Dragging:
      return {
        cursor: 'grabbing',
      };
    case CursorKind.ResizeEW:
      return {
        cursor: 'ew-resize',
      };
    case CursorKind.ResizeNS:
      return {
        cursor: 'ns-resize',
      };
    case CursorKind.DrawLine:
      return {
        cursor: `url(${IconDrawLine}) 16 16, default`,
      };
    case CursorKind.SelectBox:
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
