import { Direction } from '@circuit/algorithm';
import { ElectronicPrototype, ElectronicKind, ElectronicCategory, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'C',
  kind: ElectronicKind.Capacitor,
  category: ElectronicCategory.Passive,
  textBias: {
    Top: 22,
    Bottom: 22,
  },
  margin: [18, 50, 18, 50],
  params: [
    {
      label: '电容量',
      unit: UnitType.Farad,
      default: '100u',
      visible: true,
      ranks: ['', 'm', 'μ', 'n', 'p'],
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
        d: 'M5,0H40M-40,0H-5M-5,-16V16M5,-16V16',
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
        y: '-15',
        width: '60',
        height: '30',
      },
    },
  ],
};
