import { createUseStyles } from 'react-jss';

import {
  ExtraLightGray,
  FontSerif,
  Black,
  Blue,
  Gray,
  Shadow,
  White,
  DarkGreen,
  LightGray,
  LightBlue,
} from 'src/lib/styles';

export const aside = createUseStyles({
  aside: {
    display: 'flex',
    position: 'fixed',
    left: '0',
    top: '0',
    height: '100%',
    width: 'auto',
    backgroundColor: '#fff',
    boxShadow: `3px 0 5px ${ExtraLightGray}`,
  },
});

export const tabs = createUseStyles({
  tabs: {
    display: 'inline-flex',
    flexDirection: 'column',
    borderRight: `1px solid ${ExtraLightGray}`,
    alignItems: 'center',
    width: 50,
    padding: [10, 0],
  },
  runIcon: {
    marginBottom: 20,

    '& .anticon': {
      color: DarkGreen,
      fontSize: 26,
    },
  },
  tabIcon: {
    marginBottom: 6,

    '&.ant-btn:hover': {
      backgroundColor: ExtraLightGray,
    },
  },
  highlight: {
    backgroundColor: LightGray,

    '&.ant-btn:hover': {
      backgroundColor: LightGray,
    },
  },
});

export const menu = createUseStyles({
  panel: {
    borderRight: `1px solid ${ExtraLightGray}`,
    boxShadow: `3px 0 5px ${ExtraLightGray}`,
  },
  title: {
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
    margin: [10, 20],
    color: Black,
  },
});

export const part = createUseStyles({
  panel: {
    width: 280,
  },
  list: {
    display: 'flex',
    margin: [16, 0],
  },
  item: {
    height: 60,
    width: 60,
    margin: [0, 10],
    padding: 0,
    outline: 0,
    backgroundColor: ExtraLightGray,
    borderRadius: 5,
    border: `1px solid ${Gray}`,
    boxShadow: `0 0 3px ${Shadow}`,
    display: 'inline-block',
    transition: 'all 0.3s cubic-bezier(0.3, 0.3, 0.1, 1)',

    '&:hover': {
      backgroundColor: White,
    },

    '&:focus': {
      backgroundColor: White,
      border: `1px solid ${LightBlue}`,
      boxShadow: `0 0 3px ${LightBlue}`,
    },

    '& svg': {
      height: 52,
      width: 52,
      margin: 3,
      color: Black,
      stroke: Black,
      strokeWidth: 2,
      strokeLinecap: 'round',
      fill: 'transparent',

      '& .focus-transparent': {
        strokeWidth: 0,
      },
    },
  },
});
