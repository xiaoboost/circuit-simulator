import { Point } from '@circuit/math';
import { createDynamicStyles, createStyles } from 'src/styles';
import { FontSerif, White, Blue, DarkBlue, Silver } from 'src/styles';

/** 动画持续时间 */
export const transformTime = 400;
/** 表格宽度 */
export const formWidth = 160;

export const enum AnimationStatus {
  Before,
  Start,
  Active,
  After,
  End,
}

export interface StyleProps {
  isEnter: boolean;
  status: AnimationStatus;
  partPosition: Point;
  dialogRect: {
    width: number;
    height: number;
  };
}

export const modalStyles = createDynamicStyles({
  boxWrapper: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  boxMask: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transition: ({ status }) => {
      return status === AnimationStatus.Active
        ? `opacity ${transformTime}ms ease`
        : '';
    },
    opacity: ({ status, isEnter }: StyleProps) => {
      if (status === AnimationStatus.End) {
        return;
      }
      else if (status === AnimationStatus.Before || status === AnimationStatus.Start) {
        return isEnter ? '0' : '1';
      }
      else {
        return isEnter ? '1' : '0';
      }
    },
  },
  box: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 180,
    boxShadow: `0 1px 8px ${Silver}`,
    transformOrigin: '0 0',
    opacity: ({ status, isEnter }) => {
      if (status === AnimationStatus.End) {
        return;
      }
      else if (status === AnimationStatus.Before || status === AnimationStatus.Start) {
        return isEnter ? '0' : '1';
      }
      else {
        return isEnter ? '1' : '0';
      }
    },
    transition: ({ status }) => {
      return status === AnimationStatus.Active
        ? `all ${transformTime}ms ease`
        : '';
    },
    transform: ({ status, isEnter }: StyleProps) => {
      if (status === AnimationStatus.End) {
        return;
      }

      if (status === AnimationStatus.Before) {
        return 'scale(1,1)';
      }

      const start = 'scale(0,0)';
      const end = 'scale(1,1)';

      if (status === AnimationStatus.Start) {
        return isEnter ? start : end;
      }
      else {
        return isEnter ? end : start;
      }
    },
    left: (props: StyleProps) => {
      const start = props.partPosition[0];
      const end = props.partPosition[0] - props.dialogRect.width / 2;

      if (props.status === AnimationStatus.Start || props.status === AnimationStatus.Before) {
        return props.isEnter ? start : end;
      }
      else {
        return props.isEnter ? end : start;
      }
    },
    top: (props: StyleProps) => {
      const start = props.partPosition[1];
      const end = props.partPosition[1] - props.dialogRect.height - 20;

      if (props.status === AnimationStatus.Start || props.status === AnimationStatus.Before) {
        return props.isEnter ? start : end;
      }
      else {
        return props.isEnter ? end : start;
      }
    },
  },
});

export const formStyles = createStyles({
  boxHeader: {
    fontFamily: FontSerif,
    fontSize: 20,
    height: 35,
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
  resetInputCompact: {
    '& > *': {
      marginRight: [0, '!important'],
    },
  },
  idInput: {
    width: [(formWidth / 2) - 10, '!important'],
    marginRight: [0, '!important'],
    borderRightWidth: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  idSplit: {
    width: [20, '!important'],
    margin: [0, '!important'],
    borderLeft: 0,
    borderRight: 0,
    borderRadius: 0,
    pointerEvents: 'none',
  },
  idSubInput: {
    width: [(formWidth / 2) - 10, '!important'],
    borderLeftWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
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
  inlineFormItem: {
    lineHeight: 1,
  },
  form: {
    width: formWidth,
    lineHeight: 1,

    '& .ant-input-group': {
      display: 'flex',
    },

    '& .ant-form-item-explain': {
      display: 'none',
    }
  },
  confirmBtn: {
    color: DarkBlue,

    '&:hover': {
      color: Blue,
    },
  },
  dialogTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '10px solid #fff',
    transform: 'translateX(-6px)',
    bottom: -10,
    left: '50%',
  },
});
