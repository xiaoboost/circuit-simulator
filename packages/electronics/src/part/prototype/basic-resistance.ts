import { Direction } from '@circuit/algorithm';
import { ElectronicKind } from '../../types';
import { ElectronicPrototype, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'R',
  kind: ElectronicKind.Resistance,
  introduction: '电阻器',
  textBias: {
    top: 14,
    bottom: 14,
  },
  padding: [0, 1, 0, 1],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '阻值',
      unit: UnitType.Ohm,
      default: '10k',
      visible: true,
      ranks: ['G', 'M', 'k', ''],
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
        d: 'M-40,0H-24L-20,-9L-12,9L-4,-9L4,9L12,-9L20,9L24,0H40',
        stroke: 'currentColor',
      },
    },
  ],
};
