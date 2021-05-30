import { MouseFocusClassName } from '../electronics/parts';

import {
  createStyles,
  ExtraLightGray,
  Black,
  Gray,
  Shadow,
  White,
  Red,
  LightBlue,
} from 'src/lib/styles';

export const aside = createStyles({
  aside: {
    display: 'flex',
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100%',
    width: 'auto',
    backgroundColor: White,
    boxShadow: `-3px 0 5px ${Gray}`,
  },
});

export const part = createStyles({
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

      [`& .${MouseFocusClassName}`]: {
        strokeWidth: 0,
        fill: 'transparent',
        stroke: 'transparent',
      },
    },
  },
});

export const config = createStyles({
  section: {
    margin: [0, 0, 20, 0],
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: '1.5',
    marginBottom: 8,
    color: Black,
  },
  sectionBody: {
    margin: [0, 14],
  },
  formItem: {
    width: '100%',
    marginBottom: 12,
    position: 'relative',
  },
  formItemLabel: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)',
  },
  oscilloscopesRow: {
    display: 'flex',
    position: 'relative',
    marginBottom: 14,

    '&:hover $oscilloscopesRowDelete': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  oscilloscopesRowSelect: {
    width: '100%',
  },
  oscilloscopesRowDelete: {
    width: 16,
    fontSize: 16,
    color: Red,
    position: 'absolute',
    right: -24,
    height: '100%',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transform: 'scale(0.4)',
    transition: 'opacity .2s ease, transform .2s ease',
    cursor: 'pointer',
  },
});
