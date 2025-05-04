import { Direction } from '@circuit/math';
import { ElectronicKind, MouseFocusClassName } from '../../types';
import { ElectronicPrototype, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'OP',
  kind: ElectronicKind.OperationalAmplifier,
  introduction: '运算放大器',
  textPosition: [
    [0, 0],
  ],
  padding: [1, 0, 1, 0],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '开环增益',
      unit: UnitType.Decibel,
      default: '120',
      vision: false,
      ranks: [],
    },
    {
      label: '输入电阻',
      unit: UnitType.Ohm,
      default: '80M',
      vision: false,
      ranks: ['G', 'M', 'k', ''],
    },
    {
      label: '输出电阻',
      unit: UnitType.Ohm,
      default: '60',
      vision: false,
      ranks: ['', 'm'],
    },
    // {
    //   label: '截止频率',
    //   unit: 'Hz',
    //   default: '1M',
    //   vision: false,
    // },
  ],
  points: [
    {
      position: [-40, -20],
      direction: Direction.Left,
    },
    {
      position: [-40, 20],
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
        d: 'M-25,-35V35L25,0Z',
        fill: '#ffffff',
        stroke: 'currentColor',
      },
    },
    {
      name: 'path',
      attribute: {
        d: 'M-40,-20H-25M-40,20H-25M25,0H40',
        stroke: 'currentColor',
      },
    },
    {
      name: 'path',
      attribute: {
        d: 'M-22,-20H-16M-22,20H-16M-19,17V23',
        strokeWidth: '1',
        stroke: 'currentColor',
      },
    },
  ],
};
