import { type TextBias } from '@circuit/electronics';
import { Direction, Directions } from '@circuit/math';

export function getDirectionByLabel(label: keyof TextBias) {
  switch (label) {
    case 'left': {
      return Directions[Direction.Left];
    }
    case 'right': {
      return Directions[Direction.Right];
    }
    case 'top': {
      return Directions[Direction.Top];
    }
    case 'bottom': {
      return Directions[Direction.Bottom];
    }
    case 'center': {
      return Directions[Direction.Center];
    }
    default: {
      throw new Error(`未知的方向标签:${label}`);
    }
  }
}
