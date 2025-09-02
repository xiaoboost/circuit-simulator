import { Direction } from '@circuit/algorithm';
import {
  type ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '@circuit/types';

export const data: ElectronicPrototype = {
  pre: 'L',
  kind: ElectronicKind.Inductance,
  category: ElectronicCategory.Passive,
  textBias: {
    Top: 14,
    Bottom: 10,
  },
  margin: [
    14, 32, 1, 32,
  ],
  properties: [
    {
      name: '电感量',
      kind: PropertyKind.Number,
      unit: UnitType.Henry,
      visibleInPainter: true,
      default: {
        value: 10,
        rank: 'u',
      },
    },
  ],
  pins: [
    {
      position: [-40, 0],
      direction: Direction.Left,
    },
    {
      position: [40, 0],
      direction: Direction.Right,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        // eslint-disable-next-line
        d: 'M-40,0H-24M24,0H40M-24,0Q-18,-12,-12,0M-12,0Q-6,-12,0,0M0,0Q6,-12,12,0M12,0Q18,-12,24,0',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
  ],
};
