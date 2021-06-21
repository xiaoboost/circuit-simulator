import { ArrayLike, isLine } from '@circuit/shared';

/** 连接数据 */
export interface ConnectionData {
  id: string;
  mark: number;
}

/** 连接状态 */
export const enum ConnectionStatus {
  Part,
  Line,
  Space,
}

export class Connection extends ArrayLike<ConnectionData, [string, number]> {
  protected _isEqual(a1: ConnectionData, a2: ConnectionData) {
    return a1.id === a2.id && a1.mark === a2.mark;
  }
  protected _packaged(id: string, mark: number): ConnectionData {
    return { id, mark };
  }

  static from(data: ConnectionData[]) {
    const connection = new Connection();
    (data ?? []).forEach((item) => connection.add(item.id, item.mark));
    return connection;
  }

  getStatus(): ConnectionStatus {
    if (this.length <= 0) {
      return ConnectionStatus.Space;
    }
    else {
      return this.some((item) => !isLine(item.id))
        ? ConnectionStatus.Part
        : ConnectionStatus.Line;
    }
  }
}
