import { Direction } from '@circuit/algorithm';
import { ElectronicKind } from '../../types';
import { ElectronicPrototype } from '../types';

export const data: ElectronicPrototype = {
  pre: 'GND',
  kind: ElectronicKind.ReferenceGround,
  introduction: '参考地',
  padding: [0, 0, 0, 0],
  margin: [1, 1, 1, 1],
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
      },
    },
  ],
};
