import './global.css';
import './start-loading.css';

import 'antd/es/style/index.css';
import 'antd/es/input/style/index.css';
import 'antd/es/input-number/style/index.css';
import 'antd/es/select/style/index.css';
import 'antd/es/tooltip/style/index.css';
import 'antd/es/button/style/index.css';
import 'antd/es/form/style/index.css';
import 'antd/es/grid/style/index.css';
import 'antd/es/modal/style/index.css';

import jss from 'jss';
import nested from 'jss-plugin-nested';
import extend from 'jss-plugin-extend';
import expand from 'jss-plugin-expand';
import camelCase from 'jss-plugin-camel-case';
import defaultUnit from 'jss-plugin-default-unit';
import ruleValueFunction from 'jss-plugin-rule-value-function';

import DrawLine from '../assets/cursor/draw-line.svg';
import MoveMap from '../assets/cursor/move-map.svg';
import MovePart from '../assets/cursor/move-part.svg';

import { Styles, Classes } from 'jss';
import { isEqual } from '@xiao-ai/utils';

jss
  .use(nested())
  .use(extend())
  .use(expand())
  .use(camelCase())
  .use(defaultUnit())
  .use(ruleValueFunction());

function getCursorStyle(url: string, offset = 16) {
  return `url("${url}") ${offset} ${offset}, crosshair !important`;
}

export const drawLineCursor = getCursorStyle(DrawLine);
export const moveMapCursor = getCursorStyle(MoveMap);
export const movePartCursor = getCursorStyle(MovePart, 10);

export function createStyles<
  C extends string = string,
  Props = unknown,
>(styles: Styles<C, Props>, data?: Props): Classes<C> {
  return createDynamicStyles(styles)(data);
}

export function createDynamicStyles<
  C extends string = string,
  Props = unknown,
>(styles: Styles<C, Props>): (data?: Props) => Classes<C> {
  const styleData = jss.createStyleSheet(styles as any);

  let lastProps: Props | undefined = undefined;
  let lastClasses: Classes<C> = {} as any;

  return (data?: Props) => {
    if (!lastProps || !lastClasses || !isEqual(data, lastProps)) {
      styleData.update(data as any);
      lastProps = data;
      lastClasses = styleData.attach().classes;
    }

    return lastClasses;
  };
}

export const cursorStyles = createStyles({
  drawLine: {
    cursor: drawLineCursor,
  },
  moveMap: {
    cursor: moveMapCursor,
  },
  movePart: {
    cursor: movePartCursor,
  },
});

// 主要颜色定义
export const Blue = '#20A0FF';
export const DarkBlue = '#1D8CE0';
export const LightBlue = '#58B7FF';
export const ExtraLightBlue = '#BBDEFB';
export const Green = '#13CE66';
export const DarkGreen = '#009688';
export const Yellow = '#F7BA2A';
export const Red = '#FF4949';
export const Black = '#1F2D3D';
export const LightBlack = '#324057';
export const ExtraLightBlack = '#475669';
export const Silver = '#8492A6';
export const LightSilver = '#99A9BF';
export const ExtraLightSilver = '#C0CCDA';
export const Gray = '#D3DCE6';
export const GrayTransparent = 'rgba(0, 0, 0, 0.2)';
export const LightGray = '#E5E9F2';
export const ExtraLightGray = '#EFF2F7';
export const DarkWhite = '#F9FAFC';
export const White = '#FFFFFF';
export const Shadow = '#A1A1A1';

/**
 * 默认字体
 *  - 无衬线中英文
 */
export const FontDefault = "'Helvetica', 'Arial', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft YaHei', sans-serif";

/** 
 * 衬线字体
 *  - 主要是用在标题等醒目位置
 */
export const FontSerif = "'Georgia', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft YaHei', serif";

/**
 * 文本文字
 *  - 主要用于各种说明文本
 */
export const FontText = "'Times New Roman', 'Microsoft YaHei'";

/** 默认字体大小 */
export const FontDefaultSize = '16px';
