import { Direction } from '@circuit/algorithm';
import { ElectronicPrototype, ElectronicKind, ElectronicCategory } from '../types';

export const data: ElectronicPrototype = {
  pre: 'VM',
  kind: ElectronicKind.VoltageMeter,
  category: ElectronicCategory.Meter,
  textBias: {
    Left: 24,
    Right: 24,
  },
  padding: [1, 1, 1, 1],
  margin: [1, 0, 1, 0],
  params: [],
  pins: [
    {
      position: [0, -40],
      direction: Direction.Top,
    },
    {
      position: [0, 40],
      direction: Direction.Bottom,
    },
  ],
  shape: [
    {
      name: 'circle',
      attribute: {
        cx: '0',
        cy: '0',
        r: '19',
        fill: '#ffffff',
        stroke: 'currentColor',
      },
    },
    {
      name: 'path',
      attribute: {
        d: 'M0,-40V-20M0,20V40M0,-16V-8M-4,-12H4M-4,12H4',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
    {
      name: 'path',
      nonRotate: true,
      attribute: {
        d: 'M-5,-4L0,6L5,-4',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-20',
        y: '-30',
        width: '40',
        height: '60',
      },
    },
  ],
};
