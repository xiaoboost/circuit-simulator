import { Point } from '@circuit/algorithm';
import { ICursorKind } from '../../types';

import IconDrawLine from './assets/draw-line.svg';

export function getBackgroundStyle(scale: number, position: Point): React.CSSProperties {
  const size = scale * 20;
  const biasX = position[0] % size;
  const biasY = position[1] % size;

  return {
    backgroundSize: `${size}px`,
    backgroundPosition: `${biasX}px ${biasY}px`,
  };
}

export function getCursorStyle(cursor: ICursorKind): React.CSSProperties {
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
    default:
      return {};
  }
}
