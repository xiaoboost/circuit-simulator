import { Direction } from '@circuit/algorithm';
import { ElectronicPrototype, ElectronicKind, ElectronicCategory } from '../types';

export const data: ElectronicPrototype = {
  pre: 'GND',
  kind: ElectronicKind.ReferenceGround,
  category: ElectronicCategory.Virtual,
  margin: [10, 8, 8, 8],
  params: [],
  pins: [
    {
      position: [0, -20],
      direction: Direction.Top,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        d: 'M0,-20V0M-12,0H12M-7,5H7M-2,10H2',
        stroke: 'currentColor',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-15',
        y: '-10',
        width: '30',
        height: '26',
        fill: 'transparent',
      },
    },
  ],
};
