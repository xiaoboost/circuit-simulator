import { createStyles } from 'src/styles';
// import { MouseFocusClassName } from '@circuit/electronics';
import { FontSerif, White, Blue, DarkBlue, Shadow, DarkWhite } from 'src/styles';

/** 动画持续时间 */
export const transformTime = 400;

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
  dialogTriangleTop: {

  },
  dialogTriangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: `10px solid ${DarkWhite}`,
    borderBottom: 'none',
    bottom: -10,
    left: 'calc(50% - 6px)',

    '&$dialogTriangleTop': {
      top: -10,
      bottom: 'none',
      borderTop: 'none',
      borderBottom: `10px solid ${Blue}`,
    },
  },
});

export const formStyles = createStyles({
  editorForm: {
    position: 'relative',
    boxShadow: `0 0 3px ${Shadow}`,
    backgroundColor: DarkWhite,
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
    borderLeftWidth: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  formParamUnit: {
    '& .ant-input-group-addon': {
      width: 'auto',
      alignContent: 'center',
    },
  },
  inlineFormItem: {
    lineHeight: 1,
  },
  form: {
    lineHeight: 1,

    '& .ant-input-group': {
      display: 'flex',
    },

    '& .ant-form-item-explain': {
      display: 'none',
    },
  },
  confirmBtn: {
    color: DarkBlue,

    '&:hover': {
      color: Blue,
    },
  },
});
