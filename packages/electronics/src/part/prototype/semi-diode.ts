import { ElectronicPrototype, UnitType } from '../types';
import { ElectronicKind, MouseFocusClassName } from '../../types';
import { Direction } from '@circuit/math';

export const data: ElectronicPrototype = {
  pre: 'VD',
  kind: ElectronicKind.Diode,
  introduction: '二极管',
  txtLBias: 18,
  padding: [1, 0, 1, 0],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '导通电压',
      unit: UnitType.Volt,
      default: '1',
      vision: false,
      ranks: ['', 'm'],
    },
    {
      label: '导通电阻',
      unit: UnitType.Ohm,
      default: '0.5',
      vision: false,
      ranks: ['', 'm'],
    },
    {
      label: '关断电阻',
      unit: UnitType.Ohm,
      default: '5M',
      vision: false,
      ranks: ['G', 'M', 'k'],
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
        d: 'M0,-40V40M-13,-11H13',
        stroke: 'currentColor',
      },
    },
    {
      name: 'polygon',
      attribute: {
        points: '0,-11 -13,11 13,11',
        fill: 'currentColor',
        stroke: 'currentColor',
      },
    },
    {
      name: 'rect',
      attribute: {
        x: '-13',
        y: '-30',
        width: '26',
        height: '60',
        className: MouseFocusClassName,
      },
    },
  ],
};
