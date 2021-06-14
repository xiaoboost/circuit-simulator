import type { MarkNodeKind } from '@circuit/map';

export const NS = 'http://www.w3.org/2000/svg';
export const elIdName = 'map-debugger';
export const nodeColor: Record<keyof typeof MarkNodeKind, string> = {
  Part: 'black',
  PartPin: 'red',
  Line: 'green',
  LineSpacePoint: 'orange',
  LineCrossPoint: 'blue',
  LineCoverPoint: 'yellow',
  Space: '#fff',
};
