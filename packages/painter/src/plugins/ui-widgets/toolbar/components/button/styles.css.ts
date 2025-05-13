import { Colors } from '@circuit/shared';
import { style } from '@vanilla-extract/css';

export const selected = style({});
export const disabled = style({});

export const btn = style({
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
  outline: 'none',
  backgroundColor: Colors.White.string(),

  selectors: {
    '&:hover': {
      backgroundColor: Colors.Black.mix(Colors.White, 0.92).string(),
    },
    '&:last-child': {
      marginRight: 0,
    },
    [`&.${disabled}`]: {
      color: Colors.Black.mix(Colors.White, 0.5).string(),
      backgroundColor: Colors.White.string(),
      cursor: 'not-allowed',
    },
    // 优先级最高，所以放在最下面
    [`&.${selected}`]: {
      backgroundColor: Colors.PrimaryLight.toString(),
      color: Colors.Primary.toString(),
    },
  },
});

export const icon = style({
  height: 22,
  width: 22,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
