import { Direction } from '@circuit/algorithm';
import {
  ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '@circuit/types';

export const data: ElectronicPrototype = {
  pre: 'OP',
  kind: ElectronicKind.OperationalAmplifier,
  category: ElectronicCategory.Semiconductor,
  textBias: {
    Center: 0,
  },
  margin: [38, 32, 38, 32],
  properties: [
    {
      name: '开环增益',
      description: '运算放大器在没有反馈电路时的增益',
      kind: PropertyKind.Number,
      unit: UnitType.Decibel,
      visibleInPainter: false,
      ranks: [],
      default: {
        value: 100,
      },
    },
    {
      name: '输入电阻',
      kind: PropertyKind.Number,
      unit: UnitType.Ohm,
      visibleInPainter: false,
      ranks: ['G', 'M', 'k', ''],
      default: {
        value: 80,
        rank: 'M',
      },
    },
    {
      name: '输出电阻',
      kind: PropertyKind.Number,
      unit: UnitType.Ohm,
      visibleInPainter: false,
      ranks: ['', 'm', 'u'],
      default: {
        value: 60,
        rank: '',
      },
    },
    {
      name: '截止频率',
      description: '增益下降至直流（低频）增益的 -3 dB 点（约 70.7%） 时所对应的频率',
      kind: PropertyKind.Number,
      unit: UnitType.Hertz,
      visibleInPainter: false,
      ranks: ['k', 'M', 'G'],
      default: {
        value: 40,
        rank: 'M',
      },
    },
  ],
  pins: [
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
        fill: 'transparent',
      },
    },
    {
      name: 'path',
      attribute: {
        d: 'M-22,-20H-16M-22,20H-16M-19,17V23',
        strokeWidth: '1',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-32',
        y: '-35',
        width: '60',
        height: '70',
      },
    },
  ],
};
