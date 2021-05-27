import { createUseStyles } from 'react-jss';
import { FontSerif, White, Blue, DarkBlue, Silver } from 'src/lib/styles';

/** 动画持续时间 */
export const transformTime = 400;

export interface StyleProps {
  isStart: boolean;
  isPending: boolean;
  left: number;
  top: number;
  height: number;
  width: number;
}

export const styles = createUseStyles({
  boxWrapper: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    transition: ['opacity', `${transformTime}ms`, 'ease'],
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    opacity: (props: StyleProps) => {
      return props.isPending ? '' : props.isStart ? '0' : '1';
    },
  },
  box: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 180,
    boxShadow: `0 1px 8px ${Silver}`,
    transition: `all ${transformTime}ms ease`,
    transform: (props: StyleProps) => {
      return props.isPending ? '' : props.isStart ? 'scale(0,0)' : 'scale(1,1)';
    },
    left: ({ isStart, left, width }: StyleProps) => {
      const start = left;
      const pend = left - width / 2;
      return isStart ? start : pend;
    },
    top: ({ isStart, top, height }: StyleProps) => {
      const start = top;
      const pend = top - height - 20;
      return isStart ? start : pend;
    },
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
    display: 'flex',
    flexDirection: 'row',

    '& .ant-form-item': {
      marginBottom: 0,
    },
  },
  boxFooter: {
    backgroundColor: White,
    padding: [5, 10, 10, 10],
    textAlign: 'right',
  },
  idInput: {
    width: ['calc(50% - 10px)', '!important'],
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
    width: ['calc(50% - 10px)', '!important'],
    borderLeftWidth: 1,
  },
  formLabelList: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    fontSize: 14,
  },
  formLabelItem: {
    height: 32,
    lineHeight: '32px',

    '&::after': {
      content: '":"',
      position: 'relative',
      top: -0.5,
      margin: [0, 8, 0, 2],
    },
  },
  form: {
    width: 160,

    '& .ant-input-group': {
      display: 'flex',
    },
  },
  confirmBtn: {
    color: DarkBlue,

    '&:hover': {
      color: Blue,
    },
  },
  dialogTriangle: {

  },
});

export const enum TransformStatus {
  Start,
  End,
  None,
}

export const enum TransformName {
  Open,
  Close,
}

export interface TransformProps {
  status: TransformStatus;
  name: TransformName;
  isStart: boolean;
  left: number;
  top: number;
  height: number;
  width: number;
}

export const animation = createUseStyles({
  boxAnimate: {
    opacity: ({ status, name }: TransformProps) => {
      if (status === TransformStatus.None) {
        return '1';
      }

      if (name === TransformName.Open) {
        return status === TransformStatus.Start ? '0' : '1';
      }
      else {
        return status === TransformStatus.Start ? '1' : '0';
      }
    },
    transform: ({ status, name }: TransformProps) => {
      const small = 'scale(0,0)';
      const normal = 'scale(1,1)';

      if (status === TransformStatus.None) {
        return normal;
      }

      if (name === TransformName.Open) {
        return status === TransformStatus.Start ? small : normal;
      }
      else {
        return status === TransformStatus.Start ? normal : small;
      }
    },
    left: ({ left, width }: TransformProps) => {
      const start = 0;
      const normal = left - width / 2;

      return left;
    },
    top: ({ top }: TransformProps) => {
      return top;
    },
  },
});
