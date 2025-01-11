
import { MarkMap } from '@circuit/map';
import { remove } from '@xiao-ai/utils';
import type { Part } from '../part/part';
import { ElectronicKind } from '../types';
// import type { Line } from '../line/line';
import type { Electronic } from './electronic';

export class SheetContext {
  /** 图纸数据 */
  readonly markMap = new MarkMap();
  /** 导线储存 */
  readonly #lines: Part[] = [];
  /** 器件储存 */
  readonly #parts: Part[] = [];

  /** 搜索元件 */
  findById<E extends Electronic = Electronic>(id: string): E | undefined {
    return this.#parts.concat(this.#lines as any[]).find((item) => item.id === id) as E | undefined;
  }

  /** 添加器件 */
  add(item: Electronic) {
    if (item.kind === ElectronicKind.Line) {
      this.#lines.push(item as Part);
    }
    else {
      this.#parts.push(item as Part);
    }
  }

  /** 移除器件 */
  delete(item: Electronic) {
    if (item.kind === ElectronicKind.Line) {
      remove(this.#lines, item);
    }
    else {
      remove(this.#parts, item);
    }
  }

  /** 创建编号 */
  createId(id: string): string {
    const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;
    const all = ([] as Electronic[]).concat(this.#lines, this.#parts);

    let index = 1;

    while (all.find((item) => item.id === `${pre[1]}_${index}`)) {
      index++;
    }

    return `${pre[1]}_${index}`;
  }
}
