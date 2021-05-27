import { createUseStyles } from 'react-jss';
import { FontDefaultSize, FontDefault, Black } from 'src/lib/styles';

export const styles = createUseStyles({
  container: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    color: Black,
    fontFamily: FontDefault,
    fontSize: FontDefaultSize,
  },
});
