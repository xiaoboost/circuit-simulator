import { createStyles } from 'src/styles';
// import { MouseFocusClassName } from '@circuit/electronics';
import { FontSerif, White, Blue, DarkBlue, Silver } from 'src/styles';

/** 动画持续时间 */
export const transformTime = 400;
/** 表格宽度 */
export const formWidth = 160;

export const styles = createStyles({
  paramEditorContainer: {
    position: 'static',
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },
  paramEditorModal: {
    position: 'absolute',
  },
});

export const formStyles = createStyles({
  editorForm: {
    position: 'relative',
    boxShadow: 'rgb(161, 161, 161) 0px 0px 3px',
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
