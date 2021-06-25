import {
  createStyles,
  ExtraLightGray,
  FontSerif,
  Blue,
  White,
  Black,
  LightGray,
  DarkGreen,
} from 'src/styles';

import { tabWidth, panelWidth, animateTime } from '../constant';

export const moveStyle = createStyles({
  container: {
    position: 'absolute',
    height: '100%',
    transition: `all ${animateTime}ms ease`,
  },
});

export const panelStyle = createStyles({
  box: {
    width: panelWidth,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: White,
    zIndex: 0,
  },
  header: {
    textAlign: 'center',
    backgroundColor: Blue,
    fontFamily: FontSerif,
    padding: [15, 0],

    '& *': {
      color: White,
      margin: 0,
    },

    '& h1': {
      fontSize: 24,
    },
    '& h2': {
      fontSize: 18,
    },
  },
  body: {
    padding: [10, 20],
    color: Black,
    flexGrow: 1,
    borderRight: `1px solid ${ExtraLightGray}`,
  },
});

export const tabStyle = createStyles({
  tabs: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: tabWidth,
    padding: [10, 0],
    zIndex: 10,
    backgroundColor: White,
  },
  btn: {
    width: 40,
    height: 40,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color .2s',

    '&:hover': {
      backgroundColor: ExtraLightGray,
    },

    '&$highlight': {
      backgroundColor: LightGray,
    },
  },
  runBtn: {
    marginBottom: 20,

    '& .anticon': {
      color: DarkGreen,
      fontSize: 36,
    },

    '& [disabled]': {
      margin: 0,
      padding: 0,
      width: '100%',
    },
  },
  tabIcon: {
    marginBottom: 6,

    '&.ant-btn:hover': {
      backgroundColor: ExtraLightGray,
    },
  },
  highlight: {
    position: 'relative',
  },
});
