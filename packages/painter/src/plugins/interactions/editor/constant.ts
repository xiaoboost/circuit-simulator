export {
  PIN_STYLE_HOC_SCOPE,
  PATH_DISTORTION_HOC_SCOPE,
  MOVEMENT_HOC_SCOPE,
} from '../../hoc-modules';

export {
  type MarkMap,
  type Entity,
  EntityKind,
  MarkKind,
} from '../../../types';

/** 引脚放大时的半径 */
export const PIN_RADIUS_EXPANDED = 7;
/** 引脚收缩时的半径 */
export const PIN_RADIUS_COLLAPSED = 2;
/** 空引脚填充颜色 */
export const PIN_FILL_EMPTY = '#fff';

/** 活动引脚放大的样式 */
export const PIN_DRAW_EXPANDED_STYLE = {
  r: PIN_RADIUS_EXPANDED,
  fill: '#fff',
  strokeDasharray: '1.5 4',
} as const;

/** 固定引脚的样式 */
export const PIN_DRAW_FIXED_STYLE = {
  r: PIN_RADIUS_COLLAPSED,
  fill: 'currentColor',
} as const;
