import { Direction } from '@circuit/algorithm';
import { ElectronicKind } from '../../types';
import { ElectronicPrototype, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'Q',
  kind: ElectronicKind.TransistorNPN,
  introduction: 'NPN型三极管',
  textBias: {
    Left: 25,
  },
  padding: [1, 0, 1, 0],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '电流放大倍数',
      unit: UnitType.Space,
      default: '40',
      visible: false,
      ranks: [],
    },
    {
      label: 'B极电阻',
      unit: UnitType.Ohm,
      default: '26',
      visible: false,
      ranks: [],
    },
    {
      label: 'BE饱和压降',
      unit: UnitType.Volt,
      default: '0.6',
      visible: false,
      ranks: [],
    },
    {
      label: 'CE饱和压降',
      unit: UnitType.Volt,
      default: '1',
      visible: false,
      ranks: [],
    },
  ],
  pins: [
    {
      position: [-20, 0],
      direction: Direction.Left,
    },
    {
      position: [20, -40],
      direction: Direction.Top,
    },
    {
      position: [20, 40],
      direction: Direction.Bottom,
    },
  ],
  shape: [
    {
      name: 'path',
      attribute: {
        d: 'M-20,0H0M0,-25V25M20,-40V-28L0,-12M0,12L20,28V40',
        stroke: 'currentColor',
      },
    },
    {
      name: 'polygon',
      attribute: {
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: '0',
        points: '0,0 -11,-6 -7,0 -11,6',
        transform: 'translate(18, 26.4) rotate(38.7)',
      },
    },
  ],
  focus: [
    {
      name: 'rect',
      attribute: {
        x: '-10',
        y: '-30',
        width: '30',
        height: '60',
      },
    },
  ],
};
