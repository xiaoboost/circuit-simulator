import { IterativeCreation } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { getMark } from '../utils/mark';

export const data: IterativeCreation = (part) => {
  const BEVol = getMark();
  const CEVol = getMark();
  const CERes = getMark();

  return {
    create: ({ Factor, Source, getVoltageMatrixByPin }) => {
      // equation(currentZoom, ResB, voltageB, voltageCE) {
      //     return function(vd1, vd2) {
      //         const ans = new Array(4).fill(0);

      //         //ans[0] 基极导通压降
      //         //ans[1] E极导通压降
      //         //ans[2] 基极电阻
      //         //ans[3] 电流放大倍数
      //         if (vd1 >= voltageB) {
      //             //基极正向偏置
      //             ans[0] = voltageB;
      //             ans[2] = ResB;
      //             if (vd2 >= voltageCE) {
      //                 //发射极正向偏置
      //                 ans[1] = voltageCE;
      //                 ans[3] = - currentZoom;
      //             } else {
      //                 //发射极反向偏置
      //                 ans[1] = 0;
      //                 ans[3] = 0;
      //             }
      //         } else {
      //             //基极反向偏置
      //             ans[0] = 0;
      //             ans[1] = 0;
      //             ans[2] = 5e9;
      //             ans[3] = 0;
      //         }
      //         return (ans);
      //     };
      // },
      // create(part) {
      //     const ans = {
      //         'to': []
      //     };
      //     ans.process = partInternal[part.partType].iterative.equation(
      //         part.input[0].toVal(),
      //         part.input[1].toVal(),
      //         part.input[2].toVal(),
      //         part.input[3].toVal()
      //     );
      //     const external = partInternal['transistor_npn']['apart']['interface'];
      //     ans.describe = [
      //         {
      //             'name': 'voltage',
      //             'place': [part.id + '-' + external[0][0], part.id + '-' + external[2][0]]
      //         },
      //         {
      //             'name': 'voltage',
      //             'place': [part.id + '-' + external[1][0], part.id + '-' + external[2][0]]
      //         }
      //     ];
      //     return (ans);
      // }
      return () => {
        // ..
      };
    },
    apart: {
      parts: [
        {
          kind: ElectronicKind.DcVoltageSource,
          id: 'V1',
          params: [BEVol],
        },
        {
          kind: ElectronicKind.DcVoltageSource,
          id: 'V2',
          params: [CEVol],
        },
        {
          kind: ElectronicKind.Resistance,
          id: 'R1',
          params: [CERes],
        },
        {
          // 'partType': 'CCCS',
          kind: ElectronicKind.DcVoltageSource,
          id: 'I1',
          params: ['input-0', 'this-R1-0'],
        },
      ],
      external: [
        [
          {
            id: 'V1',
            mark: 0,
          },
        ],
        [
          {
            id: 'V2',
            mark: 0,
          },
        ],
        [
          {
            id: 'R1',
            mark: 1,
          },
          {
            id: 'I1',
            mark: 1,
          },
        ],
      ],
      internal: [
        [
          {
            id: 'R1',
            mark: 0,
          },
          {
            id: 'V1',
            mark: 1,
          },
        ],
        [
          {
            id: 'I1',
            mark: 0,
          },
          {
            id: 'V2',
            mark: 1,
          },
        ],
      ],
    },
  };
};
