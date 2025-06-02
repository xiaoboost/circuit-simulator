import { Direction } from '@circuit/algorithm';
import { ElectronicPrototype, ElectronicKind, ElectronicCategory, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'R',
  kind: ElectronicKind.Resistance,
  category: ElectronicCategory.Passive,
  textBias: {
    Top: 14,
    Bottom: 14,
  },
  margin: [15, 50, 15, 50],
  params: [
    {
      label: '阻值',
      unit: UnitType.Ohm,
      default: '10k',
      visible: true,
      ranks: ['G', 'M', 'k', ''],
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
        d: 'M-40,0H-24L-20,-9L-12,9L-4,-9L4,9L12,-9L20,9L24,0H40',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-30',
        y: '-13',
        width: '60',
        height: '26',
      },
    },
  ],
};
