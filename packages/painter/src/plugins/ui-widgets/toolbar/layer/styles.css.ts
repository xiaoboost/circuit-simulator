import { Colors } from '@circuit/shared';
import { style } from '@vanilla-extract/css';

export const toolbar = style({
  position: 'absolute',
  right: 32,
  bottom: 32,
  padding: 8,
  pointerEvents: 'auto',
  backgroundColor: Colors.White.toString(),
  border: `1px solid ${Colors.BorderBase.toString()}`,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'row',
  boxShadow: `0 2px 10px 2px ${Colors.Black.mix(Colors.White, 0.85).string()}`,
});
