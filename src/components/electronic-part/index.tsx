import React from 'react';

import { Part } from 'src/electronics';

interface Props {
  data: Part;
}

export function PartRender({ data }: Props) {
  return <g>part: { data.id }</g>
}
