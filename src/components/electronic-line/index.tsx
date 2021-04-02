import React from 'react';

import { Line } from 'src/electronics';
import { usePathRects } from './utils';

interface Props {
  data: Line;
}

export function ElectronicLine({ data }: Props) {
  const rects = usePathRects(data);

  return <g>
    <path path={data.path.stringify()} />
    {rects.map((rect, i) => (
      <rect key={i} {...rect} />
    ))}
  </g>
}
