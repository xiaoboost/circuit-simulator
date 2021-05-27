import * as Draw from './draw-search';
import * as Move from './move-search';
import * as Deform from './deform-search';

export enum SearchStatus {
  /** 普通状态 */
  DrawSpace = 10,
  /** 对齐引脚 */
  DrawAlignPoint,
  /** 对齐导线 */
  DrawAlignLine,
  /** 导线修饰 */
  DrawModification,
}

export {
  Draw,
  Move,
  Deform,
};
