import { ElectronicKind, Connect } from './types';
import { Electronics } from './part';
import { isNumber } from '@xiao-ai/utils';
import { MarkMap } from '@circuit/map';

import type { Part } from './part';
import type { Line } from './line';

/** 全局记号图纸 */
const map = new MarkMap();
/** 全局所有导线 */
const lines: Line[] = [];
/** 全局所有器件 */
const parts: Part[] = [];

// 调试模式下数据储存在全局
if (process.env.NODE_ENV === 'development') {
  (window as any)._lines = lines;
  (window as any)._parts = parts;
}

function createId(id: string): string {
  const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;
  const all = ([] as Electronic[]).concat(lines, parts);

  let index = 1;

  while (all.find((item) => item.id === `${pre[1]}_${index}`)) {
    index++;
  }

  return `${pre[1]}_${index}`;
}

interface ElectronicOption {
  id?: string;
  kind: ElectronicKind | keyof typeof ElectronicKind;
  connections?: (Connect | undefined)[];
}

export abstract class Electronic {
  /** 元件编号 */
  id: string;

  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 图纸数据 */
  readonly map = map;
  /** 元件的连接表 */
  readonly connections: (Connect | undefined)[];

  constructor(opt: ElectronicKind | ElectronicOption) {
    const options = isNumber(opt)
      ? {
        kind: opt,
      }
      : {
        ...opt,
        kind: isNumber(opt.kind)
          ? opt.kind
          : ElectronicKind[opt.kind],
      };

    this.kind = options.kind;
    this.connections = options.connections ?? [];

    if (options.id) {
      this.id = options.id;
    }
    else if (options.kind === ElectronicKind.Line) {
      this.id = createId('line');
    }
    else {
      this.id = createId(Electronics[options.kind].pre);
    }

    if (this.kind === ElectronicKind.Line) {
      lines.push(this as any);
    }
    else {
      parts.push(this as any);
    }
  }

  /** 更新视图 */
  updateView() { void 0 }
  /** 更新节点 */
  protected updatePoints() { void 0 }

  /** 删除自己 */
  delete() {
    // ..
  }

  /** 设置连接点 */
  setConnection(index: number, data?: Connect) {
    this.connections[index] = data
      ? {
        id: data.id,
        mark: data.mark,
      }
      : undefined;

    this.updatePoints();
  }

  /** 是否存在连接 */
  hasConnection(id: string, mark?: number) {
    return this.connections.some((item) => {
      if (!item) {
        return false;
      }

      if (item.id !== id) {
        return false;
      }

      if (mark && item.mark !== mark) {
        return false;
      }

      return true;
    });
  }

  /** 搜索元件 */
  find<E extends Electronic = Electronic>(id: string): E | undefined {
    return parts.concat(lines as any[]).find((item) => item.id === id) as E | undefined;
  }

  /** 设置选中的器件 */
  setSelects(parts: string[]) {
    // selects.setData(parts.filter((id) => ElectronicHash[id]));
  }
}
