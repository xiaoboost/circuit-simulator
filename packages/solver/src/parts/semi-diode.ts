import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';

export const data: PartSolverData = {
  kind: ElectronicKind.Diode,
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
    createIterator({ Factor, Source, getVoltageMatrixByPin }, part: any, mark) {
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
