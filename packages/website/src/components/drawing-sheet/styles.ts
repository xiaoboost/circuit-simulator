import { createStyles } from 'src/styles';

import Grid from 'src/assets/img/circuit-grid.svg';

export const styles = createStyles({
  sheet: {
    backgroundImage: `url("${Grid}")`,
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    backgroundSize: '20px',
    backgroundPosition: '-40px -40px',
    backgroundRepeat: 'repeat',
    userSelect: 'none',
    cursor: 'default',
    outline: 'none',
    '& svg': {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      stroke: 'Black',
      strokeWidth: '2',
      strokeLinecap: 'round',
      fill: 'transparent',
    },
  },
});
