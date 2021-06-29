import { ElectronicKind } from '@circuit/electronics';
import { IterativeCreation } from './types';
import { getMark, getSetMethod } from '../utils/mark';
import { parseNumber } from '../utils/number';

export const data: IterativeCreation = (part) => {
  const resMark = getMark();
  const volMark = getMark();
  const params = part.params.slice();
  const inputRes = 'InputR';
  const VDVol = 'VD';

  return {
    create({ Factor, Source, getVoltageMatrixByPin }) {
      /** 导通电压 */
      const onVol = parseNumber(params[0]);
      /** 导通电阻 */
      const onRes = parseNumber(params[1]);
      /** 关断电阻 */
      const offRes = parseNumber(params[2]);
      /** 电阻值标记位置 */
      const setRes = getSetMethod(Factor, resMark);
      /** 导通电压标记位置 */
      const setVol = getSetMethod(Source, volMark);
      /** 电压计算矩阵 */
      const volMatrix = (
        getVoltageMatrixByPin(part.id, 1)
          .add(getVoltageMatrixByPin(part.id, 0).factor(-1))
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
          setRes(insideRes);
          lastInsideRes = insideRes;
        }

        if (insideVol !== lastInsideVol) {
          setVol(insideVol);
          lastInsideVol = insideVol;
        }
      };
    },
    apart: {
      parts: [
        {
          kind: ElectronicKind.Resistance,
          id: inputRes,
          params: [resMark],
        },
        {
          kind: ElectronicKind.DcVoltageSource,
          id: VDVol,
          params: [volMark],
        },
      ],
      internal: [
        [
          {
            id: inputRes,
            mark: 1,
          },
          {
            id: VDVol,
            mark: 1,
          },
        ],
      ],
      external: [
        [{
          id: inputRes,
          mark: 0,
        }],
        [{
          id: VDVol,
          mark: 0,
        }],
      ],
    },
  };
};
