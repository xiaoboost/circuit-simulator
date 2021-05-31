import { ElectronicPrototype, UnitType, MouseFocusClassName } from './constant';
import { parseShortNumber, Direction } from '@circuit/math';
import { ElectronicKind } from '../constant';
import { isNumber } from '@xiao-ai/utils';

export const data: ElectronicPrototype = {
  pre: 'V',
  kind: ElectronicKind.DcVoltageSource,
  introduction: '直流电压源',
  txtLBias: 24,
  padding: [1, 1, 1, 1],
  margin: [1, 0, 1, 0],
  params: [
    {
      label: '电压值',
      unit: UnitType.Volt,
      default: '12',
      vision: true,
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
    {
      name: 'rect',
      attribute: {
        x: '-16',
        y: '-30',
        width: '32',
        height: '60',
        className: MouseFocusClassName,
      },
    },
  ],
  constant({ F, S }, params, branch) {
    const param = params[0];
    const val = isNumber(param) ? param : parseShortNumber(param);

    F.set(branch, branch, 1);
    S.set(branch, 0, val);
  },
};
