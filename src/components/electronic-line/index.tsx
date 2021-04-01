import React from 'react';

import { Line } from 'src/electronics';

interface Props {
  data: Line;
}

export function ElectronicLine({ data }: Props) {
  const linePath = data.path.length === 0 ? '' : `M${data.path.map((n) => n.join(',')).join('L')}`;

  return <g>
    <path path={linePath} />
  </g>
}
