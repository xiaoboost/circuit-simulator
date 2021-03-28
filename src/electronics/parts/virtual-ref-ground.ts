import { ElectronicPrototype } from './constant';
import { ElectronicKind } from '../types';
import { Direction } from 'src/math';

export const data: ElectronicPrototype = {
  pre: 'GND',
  kind: ElectronicKind.ReferenceGround,
  introduction: '参考地',
  txtLBias: 12,
  padding: [0, 0, 0, 0],
  margin: [1, 1, 1, 1],
  params: [],
  points: [
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
      },
    },
    {
      name: 'rect',
      attribute: {
        x: '-15', y: '-10', width: '30', height: '26', className: 'focus-transparent',
      },
    },
  ],
};
