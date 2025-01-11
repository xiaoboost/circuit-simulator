import { isLine } from '@circuit/shared';

/** 连接数据 */
export interface ConnectionData {
  id: string;
  mark: number;
}

/** 连接状态 */
export const enum ConnectionStatus {
  /** 空置 */
  Space,
  /** 另一头是器件 */
  Part,
  /** 另一头是导线 */
  Line,
}

/**
 * 连接关系
 *
 * @description 当前引脚连接了哪些引脚
 */
export class Connection extends Array<ConnectionData> {
  static fromData(data: ConnectionData | ConnectionData[]) {
    const arr = Array.isArray(data) ? data : [data];
    const connection = new Connection();
    arr.forEach((item) => connection.push(item));
    return connection;
  }

  #isEqual(a1: ConnectionData, a2: ConnectionData) {
    return a1.id === a2.id && a1.mark === a2.mark;
  }

  get status() {
    if (this.length <= 0) {
      return ConnectionStatus.Space;
    }
    else {
      return this.some((item) => !isLine(item.id))
        ? ConnectionStatus.Part
        : ConnectionStatus.Line;
    }
  }

  get isSpace() {
    return this.length === 0;
  }

  has(data: ConnectionData) {
    return Boolean(this.find((item) => this.#isEqual(item, data)));
  }

  push(...data: ConnectionData[]) {
    for (const item of data) {
      if (!this.has(item)) {
        super.push(item);
      }
    }

    return this.length;
  }

  delete(...data: ConnectionData[]) {
    for (const item of data) {
      const index = this.findIndex((item) => this.#isEqual(item, item));

      if (index > -1) {
        this.splice(index, 1);
      }
    }
  }

  clear() {
    this.length = 0;
  }
}
