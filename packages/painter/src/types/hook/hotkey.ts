/** 快捷键类型 */
export type HotKeyType = string | string[];

/** 快捷键定义 */
export interface HotKey {
  /** 钩子类别 */
  kind: 'HotKey';
  /** 快捷键 */
  key: HotKeyType;
  /** 快捷操作名称 */
  name: string;
  /** 执行函数 */
  action: () => void;
}
