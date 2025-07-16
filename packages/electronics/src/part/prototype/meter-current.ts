import { Direction } from '@circuit/algorithm';
import { ElectronicPrototype, ElectronicKind, ElectronicCategory } from '@circuit/types';

export const data: ElectronicPrototype = {
  pre: 'IM',
  kind: ElectronicKind.CurrentMeter,
  category: ElectronicCategory.Meter,
  textBias: {
    Top: 11,
    Bottom: 11,
  },
  margin: [8, 12, 8, 12],
  properties: [],
  pins: [
    {
      position: [-20, 0],
      direction: Direction.Left,
    },
    {
      position: [20, 0],
      direction: Direction.Right,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        d: 'M-20,0H20',
        stroke: 'currentColor',
      },
    },
    {
      name: 'polygon',
      attribute: {
        points: '12,0 2,-6 6,0 2,6',
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: '0',
        strokeLinecap: 'square',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-10',
        y: '-8',
        width: '20',
        height: '16',
      },
    },
  ],
};
