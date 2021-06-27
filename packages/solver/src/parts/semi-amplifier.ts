import { IterativeCreation } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { parseGainNumber } from '@circuit/math';
import { parseNumber } from '../utils/number';
import { stringifyInsidePart } from '../utils/connection';

export const data: IterativeCreation = (part) => {
  const inputResId = 'InputR';
  const outputResId = 'OutputR';
  const vcvs = 'VCVS';

  return {
    apart: {
      parts: [
        {
          kind: ElectronicKind.Resistance,
          id: inputResId,
          params: [parseNumber(part.params[1])],
        },
        {
          kind: ElectronicKind.Resistance,
          id: outputResId,
          params: [parseNumber(part.params[2])],
        },
        {
          kind: ElectronicKind.VoltageControlledVoltageSource,
          id: vcvs,
          params: [
            -parseGainNumber(parseNumber(part.params[0])),
            stringifyInsidePart(part.id, inputResId),
          ],
        },
      ],
      internal: [
        [
          {
            id: outputResId,
            mark: 0,
          },
          {
            id: vcvs,
            mark: 0,
          },
        ],
      ],
      external: [
        [
          {
            id: inputResId,
            mark: 1,
          },
        ],
        [
          {
            id: inputResId,
            mark: 0,
          },
        ],
        [
          {
            id: outputResId,
            mark: 1,
          },
        ],
      ],
    },
  };
};
