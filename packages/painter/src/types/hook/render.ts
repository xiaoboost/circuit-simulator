import { ReactNode } from 'react';

/** 渲染器基础属性 */
export interface IRendererData<T> {
  /**
   * 名称
   *
   * @description 渲染器唯一标识符
   */
  name: string;
  /**
   * 序号
   *
   * @description 顺序排列，数字越高 DOM 层级越高
   */
  order: number;
  /**
   * 当前渲染实例编号
   *
   * @description 当前渲染实例的唯一性
   */
  getKey(props: T): string;
  /**
   * 渲染组件
   *
   * @description 器件渲染器
   */
  Render(props: T): ReactNode;
}
