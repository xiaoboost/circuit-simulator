import React from 'react';

import { Line } from 'src/electronics';

interface Props {
  data: Line;
}

export function ElectronicLine({ data }: Props) {
  return <g>line: { data.id }</g>
}
