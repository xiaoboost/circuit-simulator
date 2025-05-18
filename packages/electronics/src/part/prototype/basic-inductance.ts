import { Direction } from '@circuit/algorithm';
import { ElectronicKind } from '../../types';
import { ElectronicPrototype, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'L',
  kind: ElectronicKind.Inductance,
  introduction: '电感器',
  textBias: {
    Top: 13,
    Bottom: 10,
  },
  padding: [0, 1, 0, 1],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '电感量',
      unit: UnitType.Henry,
      default: '10u',
      visible: true,
      ranks: ['', 'm', 'μ', 'n'],
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
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-30',
        y: '-10',
        width: '60',
        height: '15',
      },
    },
  ],
};
