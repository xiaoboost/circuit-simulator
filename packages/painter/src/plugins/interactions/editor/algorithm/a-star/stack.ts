import { remove } from '@xiao-ai/utils';
import type { SearchNodeData } from './types';

/** 搜索树 */
export class SearchStack {
  /** 搜索堆栈数据 */
  private stack: Record<number, SearchNodeData[]> = {};
  /** 数据堆栈估值顺序记录表 */
  private hash: number[] = [];
  /** 搜索图数据 */
  private map = new Map<string, SearchNodeData>();

  /** 未处理数据大小 */
  openSize = 0;
  /** 已处理数据大小 */
  closeSize = 0;

  /** 弹出估值最小且最早入栈的节点数值 */
  shift() {
    const minValue = this.hash[0];
    const stackCol = this.stack[minValue];

    if (stackCol) {
      const shift = stackCol.shift();

      if (stackCol.length === 0) {
        delete this.stack[minValue];
        this.hash.shift();
      }

      this.openSize--;
      this.closeSize++;

      return (shift);
    }
  }

  /** 将输入的节点放置到合适的位置 */
  push(node: SearchNodeData) {
    const value = node.value;
    const origin = this.map.get(node.position.join(','));

    // 当前位置已存在数据
    if (origin) {
      // 输入数据的估值并不低于已有数据，于是放弃
      if (value >= origin.value) {
        return;
      }

      // 已有数据所在的数据列
      const originCol = this.stack[origin.value];

      /**
       * 若数据列存在，则在数据列中删除原有数据
       *  - 这里必须加这个判断，因为数据列是可能不存在的
       */
      if (originCol) {
        // 从数据列中删除已有数据
        remove(originCol, origin);
        // 弱数据列为空，则删除数据列
        if (originCol.length === 0) {
          delete this.stack[origin.value];
          remove(this.hash, origin.value);
        }
      }
    }

    // 如果 value 在堆栈中不存在对应的数据列，新建数据列
    if (!this.stack[value]) {
      this.stack[value] = [];

      this.hash.push(value);
      this.hash.sort((pre, next) => pre > next ? 1 : -1);
    }

    // 当前数据加入堆栈
    this.stack[value].push(node);
    this.map.set(node.position.join(','), node);
    this.openSize++;
  }
}
