import { createUseStyles } from 'react-jss';
import { FontSerif, White, Blue, Silver } from 'src/lib/styles';

/** 动画延迟时间 */
export const delayTime = 400;

/** 样式选项 */
export interface StyleProps {
  visible: boolean;
}

export const styles = createUseStyles({
  boxWrapper: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    transition: ['opacity', `${delayTime}ms`, 'ease'],
    background: 'rgba(0, 0, 0, 0.2)',
    opacity: (props: StyleProps) => {
      return props.visible ? '1' : '0';
    },
  },
  box: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 180,
    boxShadow: `0 1px 8px ${Silver}`,
  },
  boxHeader: {
    fontFamily: FontSerif,
    fontSize: 20,
    lineHeight: '35px',
    color: White,
    backgroundColor: Blue,
    textAlign: 'center',
  },
  boxBody: {
    backgroundColor: White,
    padding: [5, 10],
  },
  boxFooter: {
    backgroundColor: White,
    padding: [5, 10, 10, 10],
    textAlign: 'right',
  },
  idInput: {
    width: [60, '!important'],
    borderRightWidth: 1,
    marginRight: [0, '!important'],
  },
  idSplit: {
    width: [20, '!important'],
    borderLeft: 0,
    borderRight: 0,
    pointerEvents: 'none',
  },
  idSubInput: {
    width: [60, '!important'],
    borderLeftWidth: 1,
  },
});
