
import { MarkMap } from '@circuit/map';
import { remove, Subscriber } from '@xiao-ai/utils';
import type { Line } from '../line';
import type { Part } from '../part';
import type { Electronic } from './electronic';

export class SheetContext extends Subscriber<readonly [Line[], Part[]]> {
  /** 图纸数据 */
  readonly markMap = new MarkMap();
  /** 导线储存 */
  readonly #lines: Line[] = [];
  /** 器件储存 */
  readonly #parts: Part[] = [];

  /** 搜索元件 */
  findById<E extends Electronic = Electronic>(id: string): E | undefined {
    return this.#parts.concat(this.#lines as any[]).find((item) => item.id === id) as E | undefined;
  }

  /** 添加器件 */
  add(item: Electronic) {
    if (!this.findById(item.id)) {
      const oldVal = [this.geAllLines(), this.getAllParts()] as const;

      if (item.isLine()) {
        this.#lines.push(item as Line);
      }
      else {
        this.#parts.push(item as Part);
      }

      this.notify([this.geAllLines(), this.getAllParts()], oldVal);
    }
  }

  /** 移除器件 */
  delete(item: Electronic) {
    if (this.findById(item.id)) {
      const oldVal = [this.geAllLines(), this.getAllParts()] as const;

      if (item.isLine()) {
        remove(this.#lines, item);
      }
      else {
        remove(this.#parts, item);
      }

      this.notify([this.geAllLines(), this.getAllParts()], oldVal);
    }
  }

  /** 获取所有导线 */
  geAllLines() {
    return this.#lines.slice();
  }

  /** 获取所有器件 */
  getAllParts() {
    return this.#parts.slice();
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
