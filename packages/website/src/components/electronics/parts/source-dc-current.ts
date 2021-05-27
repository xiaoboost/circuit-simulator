import { ElectronicPrototype, UnitType, MouseFocusClassName } from './constant';
import { numberParser, Direction } from 'src/math';
import { ElectronicKind } from '../constant';
import { isNumber } from '@utils/assert';

export const data: ElectronicPrototype = {
  pre: 'I',
  kind: ElectronicKind.DcCurrentSource,
  introduction: '直流电流源',
  txtLBias: 24,
  padding: [1, 1, 1, 1],
  margin: [1, 0, 1, 0],
  params: [
    {
      label: '电流值',
      unit: UnitType.Ampere,
      default: '10',
      vision: true,
    },
  ],
  points: [
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
    {
      name: 'rect',
      attribute: {
        x: '-20',
        y: '-30',
        width: '40',
        height: '60',
        className: MouseFocusClassName,
      },
    },
  ],
  constant({ H, S }, params, branch) {
    const param = params[0];
    const val = isNumber(param) ? param : numberParser(param);

    H.set(branch, branch, 1);
    S.set(branch, 0, val);
  },
};
