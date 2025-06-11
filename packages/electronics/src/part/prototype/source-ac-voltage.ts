import { Direction } from '@circuit/algorithm';
import {
  ElectronicPrototype,
  ElectronicKind,
  ElectronicCategory,
  UnitType,
  PropertyKind,
} from '@circuit/types';

export const data: ElectronicPrototype = {
  pre: 'V',
  kind: ElectronicKind.AcVoltageSource,
  category: ElectronicCategory.Power,
  textBias: {
    Left: 24,
    Right: 24,
  },
  margin: [50, 24, 50, 24],
  properties: [
    {
      name: '峰值电压',
      kind: PropertyKind.Number,
      unit: UnitType.Volt,
      visibleInPainter: true,
      default: {
        value: 220,
      },
    },
    {
      name: '频率',
      kind: PropertyKind.Number,
      unit: UnitType.Hertz,
      visibleInPainter: true,
      ranks: ['G', 'M', 'k', ''],
      default: {
        value: 50,
      },
    },
    {
      name: '偏置电压',
      description: '交流电压源的直流偏移量',
      kind: PropertyKind.Number,
      unit: UnitType.Volt,
      visibleInPainter: false,
      ranks: ['k', '', 'm'],
      default: {
        value: 0,
      },
    },
    {
      name: '初始相角',
      kind: PropertyKind.Number,
      unit: UnitType.Degree,
      visibleInPainter: false,
      ranks: [],
      default: {
        value: 0,
      },
    },
  ],
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

        d: 'M0,-40V-19.5M0,19.5V40M0,-16V-8M-4,-12H4M-4,12H4M-10,0Q-5,-10,0,0M0,0Q5,10,10,0',
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
