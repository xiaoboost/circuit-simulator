import { IterativeCreation } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { getMark, getSetMethod } from '../utils/mark';
import { parseNumber } from '../utils/number';
import { stringifyInsidePart } from '../utils/connection';

// TODO: example 中的 common-emitter-amplifier、emitter-follower 两个样例
export const data: IterativeCreation = (part) => {
  const VolBEMark = getMark();
  const VolCEMark = getMark();
  const ResBMark = getMark();
  const ratioMark = getMark();
  const VolBEId = 'VolBE';
  const VolCEId = 'VolCE';
  const CEResId = 'ResB';
  const CCCSId = 'CCCS';

  return {
    create: ({ Factor, Source, getVoltageMatrixByPin }) => {
      /** 电流放大倍数 */
      const ratio = parseNumber(part.params[0]);
      /** 基极电阻 */
      const resB = parseNumber(part.params[1]);
      /** BE 饱和压降 */
      const volBESafe = parseNumber(part.params[2]);
      /** CE 饱和压降 */
      const volCESafe = parseNumber(part.params[3]);
      /** 设置 BE 导通压降 */
      const setVolBE = getSetMethod(Source, VolBEMark);
      /** 设置 CE 导通压降 */
      const setVolCE = getSetMethod(Source, VolCEMark);
      /** 设置基极电阻 */
      const setResB = getSetMethod(Factor, ResBMark);
      /** 设置电流放大倍数 */
      const setRatio = getSetMethod(Factor, ratioMark);
      /** BE 当前电压计算矩阵 */
      const volBEMatrix = (
        getVoltageMatrixByPin(part.id, 0)
          .add(getVoltageMatrixByPin(part.id, 2).factor(-1))
      );
      /** CE 当前电压 */
      const volCEMatrix = (
        getVoltageMatrixByPin(part.id, 1)
          .add(getVoltageMatrixByPin(part.id, 2).factor(-1))
      );

      return ({ Voltage }) => {
        /** BE 当前电压 */
        const volBE = volBEMatrix.mul(Voltage).get(0, 0);
        /** CE 当前电压 */
        const volCE = volCEMatrix.mul(Voltage).get(0, 0);

        // 基极正向偏置
        if (volBE >= volBESafe) {
          setVolBE(volBESafe);
          setResB(resB);
          //发射极正向偏置
          if (volCE >= volCESafe) {
            setVolCE(volCESafe);
            setRatio(-ratio);
          }
          //发射极反向偏置
          else {
            setVolCE(0);
            setRatio(0);
          }
        }
        //基极反向偏置
        else {
          setVolBE(0);
          setVolCE(0);
          setResB(5e9);
          setRatio(0);
        }
      };
    },
    apart: {
      parts: [
        {
          kind: ElectronicKind.DcVoltageSource,
          id: VolBEId,
          params: [VolBEMark],
        },
        {
          kind: ElectronicKind.DcVoltageSource,
          id: VolCEId,
          params: [VolCEMark],
        },
        {
          kind: ElectronicKind.Resistance,
          id: CEResId,
          params: [ResBMark],
        },
        {
          kind: ElectronicKind.CurrentControlledCurrentSource,
          id: CCCSId,
          params: [ratioMark, stringifyInsidePart(part.id, CEResId)],
        },
      ],
      external: [
        [
          {
            id: VolBEId,
            mark: 0,
          },
        ],
        [
          {
            id: VolCEId,
            mark: 0,
          },
        ],
        [
          {
            id: CEResId,
            mark: 1,
          },
          {
            id: CCCSId,
            mark: 1,
          },
        ],
      ],
      internal: [
        [
          {
            id: CEResId,
            mark: 0,
          },
          {
            id: VolBEId,
            mark: 1,
          },
        ],
        [
          {
            id: CCCSId,
            mark: 0,
          },
          {
            id: VolCEId,
            mark: 1,
          },
        ],
      ],
    },
  };
};
