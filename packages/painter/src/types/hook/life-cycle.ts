/** 画布生命周期 */
export interface LifeCycle {
  /** 钩子类别 */
  kind: 'LifeCycle';
  /** 初始化之前 */
  beforeInit?(): void;
  /** 装载 DOM 之前 */
  beforeMount?(): void;
  /** 装载 DOM 之后 */
  afterMounted?(): void;
  /** 卸载画布之前 */
  beforeDestroy?(): void;
}
