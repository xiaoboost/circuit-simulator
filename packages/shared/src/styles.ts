import Color from 'color';

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
  BlackLight: Color.rgb(31, 45, 61),
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
  Default: [
    /** 思源黑体 */
    '"Source Han Sans SC"',
    '思源黑体',
    /** MacOS 默认字体 */
    '-apple-system',
    /** MacOS 苹方 */
    '"PingFang SC"',
    /** MacOS 冬青黑 */
    '"Hiragino Sans GB"',
    /** Windows 微软雅黑 */
    '"Microsoft YaHei"',
    /** Linux 文泉驿黑体 */
    '"WenQuanYi Micro Hei"',
    /** 安卓默认字体 */
    '"Noto Sans CJK SC"',
    'sans-serif',
  ].join(', '),
  /**
   * 衬线字体
   *
   * @description 主要是用在标题等醒目位置
   */
  Serif: [
    /** 思源宋体 */
    '"Source Han Serif"',
    '"思源宋体"',
    /** MocOS 宋体 */
    '"Songti SC"',
    /** MacOS 华文宋体 */
    'STSong',
    /** windows 中易中宋 */
    'STZhongsong',
    /** windows 宋体 */
    'SimSun',
    /* Android 衬线字体 */
    '"Noto Serif CJK SC"',
    /* 跨平台英文字体 */
    'Georgia',
    '"Times New Roman"',
    'serif',
  ].join(', '),
  /** 等宽字体 */
  Mono: [
    'Menlo',
    'Monaco',
    'Consolas',
    '"Courier New"',
    'monospace',
  ].join(', '),
  /**
   * 标准字体大小
   */
  DefaultSize: '16px',
};
