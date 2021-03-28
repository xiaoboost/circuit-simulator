import React from 'react';
import styles from './index.styl';

import { Part } from 'src/electronics';
import { Electronics, ElectronicKind } from 'src/electronics';
import { ElectronicPoint, PointKind, PointStatus } from '../electronic-point';
import { useInvRotate, usePoints } from './utils';

interface Props {
  data: Part;
}

export function ElectronicPart({ data }: Props) {
  const prototype = Electronics[data.kind];
  const invRotate = useInvRotate(data.rotate);
  const points = usePoints(data);
  const label = data.id.split('_');
  const showText = data.kind !== ElectronicKind.ReferenceGround;
  const texts = data.params
    .map((v, i) => ({
      ...Electronics[data.kind].params[i],
      value: v,
    }))
    .filter((txt) => txt.vision)
    .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'))

  return <g
    className='part'
    transform={`matrix(${data.rotate.join()},${data.position.join()})`}
  >
    <g className="part-focus">
      <g>
        {prototype.shape.map((item, i) => (
          React.createElement(item.name, {
            ...item.attribute,
            key: i,
          })
        ))}
      </g>
      {points.map((point, i) => (
        <ElectronicPoint
          key={i}
          size={point.size}
          kind={PointKind.Part}
          status={PointStatus.Open}
          transform={`translate(${point.origin.join()})`}
        />
      ))}
    </g>
    {showText && (
      <g
        className={styles.partText}
        transform={`matrix(${invRotate.join()},${data.textPosition.rotate(invRotate).join()})`}
      >
        <text>
          <tspan>{label[0]}</tspan>
          <tspan fontSize="70%">{label[1]}</tspan>
        </text>
        {texts.map((text, i) => (
          <text key={i} dy={16 * (i + 1)}>{text}</text>
        ))}
      </g>
    )}
  </g>
}
