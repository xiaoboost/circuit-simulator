import { ElectronicPrototype, UnitType } from '../types';
import { ElectronicKind, MouseFocusClassName } from '../../types';
import { Direction } from '@circuit/math';

export const data: ElectronicPrototype = {
  pre: 'C',
  kind: ElectronicKind.Capacitor,
  introduction: '电容器',
  txtLBias: 22,
  padding: [0, 1, 0, 1],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '电容量',
      unit: UnitType.Farad,
      default: '100u',
      vision: true,
      ranks: ['', 'm', 'μ', 'n', 'p'],
    },
  ],
  points: [
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
      },
    },
    {
      name: 'rect',
      attribute: {
        x: '-30',
        y: '-15',
        width: '60',
        height: '30',
        className: MouseFocusClassName,
      },
    },
  ],
};
