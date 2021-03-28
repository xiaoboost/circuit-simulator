import { ElectronicPrototype, UnitType } from './constant';
import { PartData, ElectronicKind } from '../types';
import { numberParser, Direction } from 'src/math';

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
      },
    },
    {
      name: 'polygon',
      attribute: {
        points: '0,-11 -13,11 13,11', className: 'fill-black', // fill: '#3B4449', 'strokeWidth': '1'
      },
    },
    {
      name: 'rect',
      attribute: {
        x: '-13', y: '-30', width: '26', height: '60', className: 'focus-transparent',
      },
    },
  ],
  apart: {
    parts: [
      {
        kind: ElectronicKind.Resistance,
        id: 'R1',
        params(_, mark) {
          return [mark];
        },
      },
      {
        kind: ElectronicKind.DcVoltageSource,
        id: 'VD1',
        params(_, mark) {
          return [mark + 1];
        },
      },
    ],
    connect: [
      ['R1-1', 'VD1-1'],
    ],
    interface: [
      ['R1-0'],
      ['VD1-0'],
    ],
  },
  iterative: {
    createIterator({ Factor, Source, getVoltageMatrixByPin }, part: PartData, mark) {
      // /** 导通电压 */
      // const onVol = numberParser(part.params[0]);
      // /** 导通电阻 */
      // const onRes = numberParser(part.params[1]);
      // /** 关断电阻 */
      // const offRes = numberParser(part.params[2]);
      // /** 电阻值标记位置 */
      // const resPosition = Factor.filterPosition(mark);
      // /** 导通电压标记位置 */
      // const volPosition = Source.filterPosition(mark + 1);
      // /** 电压计算矩阵 */
      // const volMatrix = (
      //   getVoltageMatrixByPin(`${part.id}-0`)
      //     .add(getVoltageMatrixByPin(`${part.id}-1`).factor(-1))
      // );

      // // 缓存上一次的计算值
      // // 赋值为 NaN 是为了第一次强制写入
      // let lastInsideRes = NaN;
      // let lastInsideVol = NaN;

      return ({ Voltage }) => {
        // /** 当前器件电压 */
        // const vol = volMatrix.mul(Voltage).get(0, 0);
        // /** 二极管内阻 */
        // const insideRes = (vol >= onVol) ? onRes : offRes;
        // /** 二极管压降 */
        // const insideVol = (vol >= onVol) ? onVol : 0;

        // if (insideRes !== lastInsideRes) {
        //   resPosition.forEach(([i, j]) => Factor.set(i, j, insideRes));
        //   lastInsideRes = insideRes;
        // }

        // if (insideVol !== lastInsideVol) {
        //   volPosition.forEach(([i, j]) => Source.set(i, j, insideVol));
        //   lastInsideVol = insideVol;
        // }
      };
    },
  },
};

export default data;
