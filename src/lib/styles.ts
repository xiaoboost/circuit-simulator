import { createUseStyles, jss } from 'react-jss';

import DrawLine from '../assets/cursor/draw-line.svg';
import MoveMap from '../assets/cursor/move-map.svg';
import MovePart from '../assets/cursor/move-part.svg';

function getCursorStyle(url: string, offset = 16) {
  return `url("${url}") ${offset} ${offset}, crosshair`;
}

export const drawLineCursor = getCursorStyle(DrawLine);
export const moveMapCursor = getCursorStyle(MoveMap);
export const movePartCursor = getCursorStyle(MovePart, 10);

export const cursorStyles = jss.createStyleSheet({
  drawLine: {
    cursor: drawLineCursor,
  },
  moveMap: {
    cursor: moveMapCursor,
  },
  movePart: {
    cursor: movePartCursor,
  },
}).attach().classes;

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

// 默认字体大小
export const FontDefaultSize = '16px';
