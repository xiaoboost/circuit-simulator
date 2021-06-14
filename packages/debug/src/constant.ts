import { MarkNodeKind } from '@circuit/map';

export const NS = 'http://www.w3.org/2000/svg';
export const elIdName = 'map-debugger';
export const color = {
  [MarkNodeKind.Part]: 'black',
  [MarkNodeKind.PartPin]: 'red',
  [MarkNodeKind.Line]: 'green',
  [MarkNodeKind.LineSpacePoint]: 'orange',
  [MarkNodeKind.LineCrossPoint]: 'blue',
  [MarkNodeKind.LineCoverPoint]: 'yellow',
};
