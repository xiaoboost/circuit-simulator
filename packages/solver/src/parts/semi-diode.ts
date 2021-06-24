import { PartSolverData } from './types';
import { parseShortNumber } from '@circuit/math';
import { ElectronicKind } from '@circuit/electronics';
import { getMark } from '../utils/mark';
import { stringifyPin } from '../utils/connection';

export const data: PartSolverData = {
  kind: ElectronicKind.Diode,
  apart: {
    parts: [
      {
        kind: ElectronicKind.Resistance,
        id: 'R1',
        params(_) {
          return [];
          // return [mark];
        },
      },
      {
        kind: ElectronicKind.DcVoltageSource,
        id: 'VD1',
        params(_) {
          return [];
          // return [mark + 1];
        },
      },
    ],
    internal: [
      [
        {
          id: 'R1',
          mark: 1,
        },
        {
          id: 'VD1',
          mark: 1,
        },
      ],
    ],
    external: [
      [{
        id: 'R1',
        mark: 0,
      }],
      [{
        id: 'VD1',
        mark: 0,
      }],
    ],
  },
  iterative: () => {
    const resMark = getMark();
    const volMark = getMark();

    return {
      create({ Factor, Source, getVoltageMatrixByPin }, part: any) {
        /** 导通电压 */
        const onVol = parseShortNumber(part.params[0]);
        /** 导通电阻 */
        const onRes = parseShortNumber(part.params[1]);
        /** 关断电阻 */
        const offRes = parseShortNumber(part.params[2]);
        /** 电阻值标记位置 */
        const resPosition = Factor.filterPosition(resMark);
        /** 导通电压标记位置 */
        const volPosition = Source.filterPosition(volMark);
        /** 电压计算矩阵 */
        const volMatrix = (
          getVoltageMatrixByPin(stringifyPin(part.id, 0))
            .add(getVoltageMatrixByPin(stringifyPin(part.id, 1)).factor(-1))
        );

        // 缓存上一次的计算值
        // 赋值为 NaN 是为了第一次强制写入
        let lastInsideRes = NaN;
        let lastInsideVol = NaN;

        return ({ Voltage }) => {
          /** 当前器件电压 */
          const vol = volMatrix.mul(Voltage).get(0, 0);
          /** 二极管内阻 */
          const insideRes = (vol >= onVol) ? onRes : offRes;
          /** 二极管压降 */
          const insideVol = (vol >= onVol) ? onVol : 0;

          if (insideRes !== lastInsideRes) {
            resPosition.forEach(([i, j]) => Factor.set(i, j, insideRes));
            lastInsideRes = insideRes;
          }

          if (insideVol !== lastInsideVol) {
            volPosition.forEach(([i, j]) => Source.set(i, j, insideVol));
            lastInsideVol = insideVol;
          }
        };
      },
    };
  },
};
