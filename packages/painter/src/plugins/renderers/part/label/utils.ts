import { Direction, DirectionVectorSet } from '@circuit/algorithm';
import { type TextBias } from '@circuit/electronics';

export function getDirectionByLabel(label: keyof TextBias) {
  switch (label) {
    case 'left': {
      return DirectionVectorSet[Direction.Left];
    }
    case 'right': {
      return DirectionVectorSet[Direction.Right];
    }
    case 'top': {
      return DirectionVectorSet[Direction.Top];
    }
    case 'bottom': {
      return DirectionVectorSet[Direction.Bottom];
    }
    case 'center': {
      return DirectionVectorSet[Direction.Center];
    }
    default: {
      throw new Error(`未知的方向标签:${label}`);
    }
  }
}
