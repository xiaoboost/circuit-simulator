import { ElectronicKind } from '@circuit/electronics';
import { PartSolverData } from './types';
import { getMark } from '../utils/mark';
import { parseNumber } from '../utils/number';

export const data: PartSolverData = {
  kind: ElectronicKind.Diode,
  iterative(part) {
    const resMark = getMark();
    const volMark = getMark();
    const params = part.params.slice();

    return {
      create({ Factor, Source, getVoltageMatrixByPin }) {
        /** 导通电压 */
        const onVol = parseNumber(params[0]);
        /** 导通电阻 */
        const onRes = parseNumber(params[1]);
        /** 关断电阻 */
        const offRes = parseNumber(params[2]);
        /** 电阻值标记位置 */
        const resPosition = Factor.filterPosition(resMark);
        /** 导通电压标记位置 */
        const volPosition = Source.filterPosition(volMark);
        /** 电压计算矩阵 */
        const volMatrix = (
          getVoltageMatrixByPin(part.id, 0)
            .add(getVoltageMatrixByPin(part.id, 1).factor(-1))
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
      apart: {
        parts: [
          {
            kind: ElectronicKind.Resistance,
            id: 'R1',
            params: [resMark],
          },
          {
            kind: ElectronicKind.DcVoltageSource,
            id: 'VD1',
            params: [volMark],
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
    };
  },
};
