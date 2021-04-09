import { ElectronicPrototype, MouseFocusClassName } from './constant';
import { ElectronicKind } from '../constant';
import { Direction } from 'src/math';

export const data: ElectronicPrototype = {
  pre: 'IM',
  kind: ElectronicKind.CurrentMeter,
  introduction: '电流表',
  txtLBias: 11,
  padding: [0, 0, 0, 0],
  margin: [1, 1, 1, 1],
  params: [],
  points: [
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
        strokeWidth: '0.5',
        strokeLinecap: 'square',
      },
    },
    {
      name: 'rect',
      attribute: {
        x: '-10',
        y: '-8',
        width: '20',
        height: '16',
        className: MouseFocusClassName,
      },
    },
  ],
};
