import { globalStyle, globalKeyframes } from '@vanilla-extract/css';
import { startLoading, Colors, Fonts } from './constant';

const startId = `#${startLoading}`;
const borderKeyframe = 'border-colors';
const backgroundKeyframe = 'background-colors';
const loaderKeyframe = 'loader';
const loaderInnerKeyframe = 'loader-inner';

globalStyle(startId, {
  position: 'absolute',
  background: Colors.Black.mix(Colors.White, 0.1).alpha(0.96).string(),
  height: '100%',
  width: '100%',
  zIndex: 10,
  opacity: 1,
  transition: 'opacity 200ms linear',
});

globalStyle(`${startId} > div`, {
  borderRadius: 25,
  backgroundColor: Colors.Black.mix(Colors.White, 0.15).string(),
  boxShadow: `0 0 10px ${Colors.Black.toString()}`,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  width: 200,
  height: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

globalStyle(`${startId} > div h3`, {
  fontFamily: Fonts.Default,
  padding: 0,
  fontSize: 18,
  fontWeight: 'normal',
  color: Colors.SecondaryText.toString(),
  textShadow: '1px 1px 2px black',
  height: '18px',
  lineHeight: '18px',
  margin: '26px 0',
});

globalStyle(`${startId} > div h3:first-child`, {
  fontStyle: 'italic',
});

globalStyle(`${startId} > div > div`, {
  display: 'inline-block',
  width: 30,
  height: 30,
  minHeight: 30,
  minWidth: 30,
  position: 'relative',
  border: '4px solid #fff',
  borderRadius: 5,
  animation: `${loaderKeyframe} 2s infinite ease, ${borderKeyframe} 2s infinite ease`,
});

globalStyle(`${startId} > div > div > span`, {
  verticalAlign: 'top',
  display: 'inline-block',
  width: '100%',
  animation: `${loaderInnerKeyframe} 2s infinite ease-in, ${backgroundKeyframe} 2s infinite ease`,
});

globalKeyframes(borderKeyframe, {
  '0%': {
    borderColor: '#4285F4',
  },
  '25%': {
    borderColor: '#DE3E35',
  },
  '50%': {
    borderColor: '#F7C223',
  },
  '75%': {
    borderColor: '#1B9A59',
  },
  '100%': {
    borderColor: '#4285F4',
  },
});

globalKeyframes(backgroundKeyframe, {
  '0%': {
    backgroundColor: '#4285F4',
  },
  '25%': {
    backgroundColor: '#DE3E35',
  },
  '50%': {
    backgroundColor: '#F7C223',
  },
  '75%': {
    backgroundColor: '#1B9A59',
  },
  '100%': {
    backgroundColor: '#4285F4',
  },
});

globalKeyframes(loaderKeyframe, {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '25%': {
    transform: 'rotate(180deg)',
  },
  '50%': {
    transform: 'rotate(180deg)',
  },
  '75%': {
    transform: 'rotate(360deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

globalKeyframes(loaderInnerKeyframe, {
  '0%': {
    height: '0%',
  },
  '25%': {
    height: '0%',
  },
  '50%': {
    height: '100%',
  },
  '75%': {
    height: '100%',
  },
  '100%': {
    height: '0%',
  },
});
