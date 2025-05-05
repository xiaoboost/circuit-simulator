import { Direction } from '@circuit/math';
import { ElectronicKind } from '../../types';
import { ElectronicPrototype, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'V',
  kind: ElectronicKind.DcVoltageSource,
  introduction: '直流电压源',
  textBias: {
    left: 24,
    right: 24,
  },
  padding: [1, 1, 1, 1],
  margin: [1, 0, 1, 0],
  params: [
    {
      label: '电压值',
      unit: UnitType.Volt,
      default: '12',
      visible: true,
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
      name: 'path',
      attribute: {
        d: 'M0,-40V-5M0,5V40M-16,-5H16M-10.5,5H10.5M-10,-12H-5M-7.5,-15V-9',
        stroke: 'currentColor',
      },
    },
  ],
};
