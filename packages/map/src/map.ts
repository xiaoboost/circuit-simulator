import { PointLike } from '@circuit/math';
import { MarkMapNode } from './node';
import { NodeInputData, MarkNodeStructuredData } from './types';

/** 标记图纸 */
export class MarkMap {
  /** 节点转换为索引 key */
  static toKey(node: PointLike) {
    return `${node[0]},${node[1]}`;
  }

  /** 数据储存 */
  private _data: Record<string, MarkMapNode> = {};

  /** 清除所有数据 */
  clear() {
    this._data = {};
  }

  /** 是否含有此节点 */
  has(point: PointLike): boolean {
    return Boolean(this._data[MarkMap.toKey(point)]);
  }

  /** 设置节点数据 */
  set(data: NodeInputData) {
    const node = new MarkMapNode(data, this);
    this._data[MarkMap.toKey(data.position)] = node;
    return node;
  }

  /** 获取节点数据 */
  get(point: PointLike): MarkMapNode | undefined {
    return this._data[MarkMap.toKey(point)];
  }

  /** 移除节点信息 */
  delete(point: PointLike) {
    delete this._data[MarkMap.toKey(point)];
  }

  /** 数据格式化 */
  toData() {
    const data: Record<string, MarkNodeStructuredData> = {};

    for (const key of Object.keys(this._data)) {
      data[key] = this._data[key].toData();
    }

    return data;
  }
}
