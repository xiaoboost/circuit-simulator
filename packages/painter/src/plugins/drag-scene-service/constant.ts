import { createServiceKey } from '../../context';
import type { IDragSceneService } from '../../types';

/**
 * 鼠标指针服务键
 *
 * @description 该服务用于获取鼠标指针变换功能
 * @example
 * ```ts
 * const dragSceneService = usePainterService(DRAG_SCENE_SERVICE);
 * ```
 */
export const DRAG_SCENE_SERVICE =
  createServiceKey<IDragSceneService>('DragSceneService');
