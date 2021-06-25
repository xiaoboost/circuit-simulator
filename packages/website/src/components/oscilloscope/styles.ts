import { createStyles, ExtraLightGray } from 'src/styles';

export const headerHeight = 32;

export const panel = createStyles({
  main: {
    width: '60vw',
    height: '100%',
    overflowY: 'auto',
    borderRight: `1px solid ${ExtraLightGray}`,
  },
  header: {
    height: headerHeight,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body: {

  },
});

export const container = createStyles({
  main: {
    width: '100%',
  },
});
