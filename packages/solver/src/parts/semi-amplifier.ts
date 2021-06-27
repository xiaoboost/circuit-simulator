import { IterativeCreation } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { getMark } from '../utils/mark';

export const data: IterativeCreation = (part) => {
  const inputRes = getMark();
  const outputRes = getMark();

  return {
    create: ({ Factor, Source, getVoltageMatrixByPin }) => {
      //   'equation' (voltage) {
      //     let ans = 0;
      //     //当前数据进入“输入数据队列”
      //     this.input.unshift(voltage);
      //     this.input.pop();
      //     for (let i = 0; i < this.input.length; i++) {
      //         ans += this.inputFactor[i] * this.input[i];
      //     }
      //     for (let i = 0; i < this.output.length; i++) {
      //         ans += this.outputFactor[i] * this.output[i];
      //     }
      //     //输出数据进入“输出数据队列”
      //     this.output.unshift(ans);
      //     this.output.pop();
      //     return ([ans]);
      // },
      // 'create'(part) {
      //     const rad = 0.5 / Math.PI;
      //     //第一个极点
      //     const pole = [];
      //     let bandWidth = Math.log10(Math.toValue(part.input[1])) * 20;
      //     let openLoopGain = parseFloat(part.input[0]);
      //     pole[0] = 1 / Math.pow(10, (bandWidth - openLoopGain) / 20);
      //     //第二个极点
      //     pole[1] = 1 / Math.round(Math.pow(10, (bandWidth + 4) / 20));
      //     //开环增益转换为普通单位
      //     openLoopGain = Math.pow(10, openLoopGain / 20);
      //     //传递函数
      //     const transfer = new Polynomial(
      //         [openLoopGain],                                             //分子为开环增益常数
      //         Polynomial.conv([1, pole[0] * rad], [1, pole[1] * rad])     //分母为双极点多项式相乘
      //     );
      //     //采样间隔时间
      //     const stepSize = Math.signFigures(Math.toValue(document.getElementById('stepsize').value));
      //     const ans = {
      //         'to': []
      //     };
      //     //差分方程绑定到迭代公式
      //     ans.process = partInternal[part.partType]['iterative']['equation'].bind(transfer.toDiscrete(stepSize));
      //     ans.describe = [
      //         {'name': 'voltage', 'place': [part.id + '-R1-1', part.id + '-R1-0']}
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
          kind: ElectronicKind.Resistance,
          id: 'R1',
          params: [inputRes],
        },
        {
          kind: ElectronicKind.Resistance,
          id: 'R2',
          params: [outputRes],
        },
        {
          // 'partType': 'VCVS',
          kind: ElectronicKind.DcVoltageSource,
          id: 'VD1',
          params: ['input-0', 'this-R1-0'],
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
            mark: 0,
          },
        ],
      ],
      external: [
        [{
          id: 'R1',
          mark: 1,
        }],
        [{
          id: 'R1',
          mark: 0,
        }],
        [{
          id: 'R2',
          mark: 0,
        }],
      ],
    },
  };
};
