import { Direction } from '@circuit/algorithm';
import { ElectronicPrototype, ElectronicKind, ElectronicCategory, UnitType } from '../types';

export const data: ElectronicPrototype = {
  pre: 'I',
  kind: ElectronicKind.DcCurrentSource,
  category: ElectronicCategory.Power,
  textBias: {
    Left: 24,
    Right: 24,
  },
  margin: [50, 24, 50, 24],
  params: [
    {
      label: '电流值',
      unit: UnitType.Ampere,
      default: '10',
      visible: true,
    },
  ],
  pins: [
    {
      position: [0, 40],
      direction: Direction.Bottom,
    },
    {
      position: [0, -40],
      direction: Direction.Top,
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
        d: 'M0,-40V-20M0,20V40M0,-12V12',
        stroke: 'currentColor',
        fill: 'transparent',
      },
    },
    {
      name: 'polygon',
      attribute: {
        points: '0,-14 -5,-4 0,-8 5,-4',
        fill: 'currentColor',
        stroke: 'currentColor',
        strokeWidth: '0.5',
        strokeLinecap: 'square',
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
