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
