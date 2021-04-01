import { ElectronicPrototype, UnitType } from './constant';
import { ElectronicKind } from '../constant';
import { Direction } from 'src/math';

export const data: ElectronicPrototype = {
  pre: 'Q',
  kind: ElectronicKind.TransistorNPN,
  introduction: 'NPN型三极管',
  txtLBias: 25,
  padding: [1, 0, 1, 0],
  margin: [1, 1, 1, 1],
  params: [
    {
      label: '电流放大倍数',
      unit: UnitType.Space,
      default: '40',
      vision: false,
      ranks: [],
    },
    {
      label: 'B极电阻',
      unit: UnitType.Ohm,
      default: '26',
      vision: false,
      ranks: [],
    },
    {
      label: 'BE饱和压降',
      unit: UnitType.Volt,
      default: '0.6',
      vision: false,
      ranks: [],
    },
    {
      label: 'CE饱和压降',
      unit: UnitType.Volt,
      default: '1',
      vision: false,
      ranks: [],
    },
  ],
  points: [
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
      },
    },
    {
      name: 'polygon',
      attribute: {
        className: 'fill-black',
        points: '0,0 -11,-6 -7,0 -11,6',
        transform: 'translate(18, 26.4) rotate(38.7)',
      },
    },
    {
      name: 'rect',
      attribute: {
        x: '-10', y: '-30', width: '30', height: '60', className: 'focus-transparent',
      },
    },
  ],
};
