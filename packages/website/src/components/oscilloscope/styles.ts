import { createStyles, ExtraLightGray, White } from 'src/styles';

export const headerHeight = 32;

export const panel = createStyles({
  main: {
    width: '70vw',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    borderRight: `1px solid ${ExtraLightGray}`,
    backgroundColor: White,
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
