import React from 'react';

import { Part } from 'src/electronics';
import { Electronics } from 'src/electronics';
import { ElectronicPoint } from '../electronic-point';
import { useInvRotate, usePoints } from './utils';

interface Props {
  data: Part;
}

export function ElectronicPart({ data }: Props) {
  const prototype = Electronics[data.kind];
  const inv = useInvRotate(data.rotate);
  const points = usePoints(data);

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
          r={point.size}
          transform={`translate(${point.origin.join()})`}
        />
      ))}
    </g>
  </g>
}
