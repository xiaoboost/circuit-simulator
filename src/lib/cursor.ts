import DrawLine from '../assets/cursor/draw-line.svg';
import MoveMap from '../assets/cursor/move-map.svg';

export enum CursorKind {
  DrawLine,
  MoveMap,
}

const cursors = {
  [CursorKind.DrawLine]: DrawLine,
  [CursorKind.MoveMap]: MoveMap,
};

export function getCursorStyle(cursor: CursorKind) {
  return `url("${cursors[cursor]}") 16 16, crosshair`;
}
