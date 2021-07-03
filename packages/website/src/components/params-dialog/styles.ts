import { Point } from '@circuit/math';
import { createDynamicStyles } from 'src/styles';
import { FontSerif, White, Blue, DarkBlue, Silver } from 'src/styles';

/** 动画持续时间 */
export const transformTime = 400;

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

export const styles = createDynamicStyles({
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
