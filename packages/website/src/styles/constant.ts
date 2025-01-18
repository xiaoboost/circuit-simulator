import Color from 'color';

/** 初始加载画面样式编号 */
export const startLoading = 'start-loading';

/**
 * 标准色值
 */
export const Colors = {
  Primary: Color.rgb(64, 158, 255),
  PrimaryLight: Color.rgb(217, 236, 255),
  PrimaryLighter: Color.rgb(236, 245, 255),
  Success: Color.rgb(103, 194, 58),
  SuccessLight: Color.rgb(225, 243, 216),
  SuccessLighter: Color.rgb(240, 249, 235),
  Warning: Color.rgb(230, 162, 60),
  WarningLight: Color.rgb(250, 236, 216),
  WarningLighter: Color.rgb(253, 246, 236),
  Danger: Color.rgb(245, 108, 108),
  DangerLight: Color.rgb(253, 226, 226),
  DangerLighter: Color.rgb(254, 240, 240),
  Info: Color.rgb(144, 147, 153),
  InfoLight: Color.rgb(233, 233, 235),
  InfoLighter: Color.rgb(244, 244, 245),
  PrimaryText: Color.rgb(48, 49, 51),
  RegularText: Color.rgb(96, 98, 102),
  SecondaryText: Color.rgb(144, 147, 153),
  PlaceholderText: Color.rgb(192, 196, 204),
  BorderBase: Color.rgb(220, 223, 230),
  BorderLight: Color.rgb(228, 231, 237),
  BorderLighter: Color.rgb(235, 238, 245),
  BorderExtraLight: Color.rgb(242, 246, 252),
  Black: Color.rgb(0, 0, 0),
  White: Color.rgb(255, 255, 255),
};

/**
 * 标准字体
 */
export const Fonts = {
  /**
   * 默认字体
   *
   * @description 无衬线中英文
   */
  Default: (
    "'Helvetica'," +
    "'Arial'," +
    "'Hiragino Sans GB'," +
    "'WenQuanYi Micro Hei'," +
    "'Microsoft YaHei'," +
    'sans-serif'
  ),
  /**
   * 衬线字体
   *
   * @description 主要是用在标题等醒目位置
   */
  Serif: "'Georgia', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft YaHei', serif",
  /**
   * 文本文字
   *
   * @description 主要用于各种说明文本
   */
  Text: "'Times New Roman', 'Microsoft YaHei'",
  /**
   * 标准字体大小
   */
  DefaultSize: '16px',
};
