import { createServiceKey } from '../../context';

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

/** 鼠标拖动服务 */
export interface IDragSceneService {
  /** 当前正在进行的拖动场景 */
  scenes: readonly string[];
  /** 当前没有进行任何拖动场景 */
  get isEmpty(): boolean;
  /** 添加场景 */
  addScene(scene: string): void;
  /** 移除场景 */
  removeScene(scene: string): void;
}
