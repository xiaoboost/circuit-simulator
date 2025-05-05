import { Direction } from '@circuit/math';
import { ElectronicKind } from '../../types';
import { ElectronicPrototype, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'V',
  kind: ElectronicKind.AcVoltageSource,
  introduction: '交流电压源',
  textBias: {
    left: 24,
    right: 24,
  },
  padding: [1, 1, 1, 1],
  margin: [1, 0, 1, 0],
  params: [
    {
      label: '峰值电压',
      unit: UnitType.Volt,
      default: '220',
      visible: true,
      ranks: ['k', '', 'm'],
    },
    {
      label: '频率',
      unit: UnitType.Hertz,
      default: '50',
      visible: true,
      ranks: ['M', 'k', '', 'm'],
    },
    {
      label: '偏置电压',
      unit: UnitType.Volt,
      default: '0',
      visible: false,
      ranks: ['k', '', 'm'],
    },
    {
      label: '初始相角',
      unit: UnitType.Degree,
      default: '0',
      visible: false,
      ranks: [],
    },
  ],
  points: [
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
      },
    },
  ],
};
