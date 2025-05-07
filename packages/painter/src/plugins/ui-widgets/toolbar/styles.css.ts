import { Colors } from '@circuit/shared';
import { style } from '@vanilla-extract/css';

export const toolbar = style({
  position: 'absolute',
  right: 32,
  bottom: 72,
  padding: 8,
  pointerEvents: 'auto',
  backgroundColor: Colors.White.toString(),
  border: `1px solid ${Colors.BorderBase.toString()}`,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'row',
  boxShadow: `0 2px 10px 2px ${Colors.Black.mix(Colors.White, 0.85).string()}`,
});

export const selected = style({});

export const actionIcon = style({
  fontSize: 20,
  height: 36,
  minWidth: 36,
  borderRadius: 6,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 200ms ease',
  cursor: 'pointer',
  marginRight: 4,

  selectors: {
    '&:hover': {
      backgroundColor: Colors.Black.mix(Colors.White, 0.9).string(),
    },
    '&:last-child': {
      marginRight: 0,
    },
    [`&.${selected}`]: {
      backgroundColor: Colors.PrimaryLight.toString(),
      color: Colors.Primary.toString(),
      cursor: 'default',
    },
  },
});

export const actionIconInner = style({
  height: 22,
  width: 22,
});
