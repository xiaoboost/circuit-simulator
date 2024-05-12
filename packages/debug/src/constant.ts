import type { MarkKind } from '@circuit/map';

export const NS = 'http://www.w3.org/2000/svg';
export const elIdName = 'map-debugger';
export const nodeColor: Record<keyof typeof MarkKind, string> = {
  Part: 'black',
  PartPin: 'red',
  PartPinLine: 'pink',
  Line: 'green',
  LinePoint: 'orange',
  LineCross: 'blue',
  LineCover: 'yellow',
};
