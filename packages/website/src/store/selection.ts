import { Watcher, isArray } from '@xiao-ai/utils';
import { parts, lines } from './sheet';
import { ElectronicKind } from '@circuit/electronics';

import type { PartComponent, LineComponent } from 'src/components/electronics';

type Component = PartComponent | LineComponent;

/** 器件选中状态 */
export const enum SelectionStatus {
  /**
   * 全部选中
   *  - 器件
   *  - 两端连接都选中的导线
   */
  All = 1,
  /**
   * 部分选中
   *  - 一端连接被选中，另一端空置的导线
   */
  Half,
}

/** 当前选择到器件 */
export const data = new Watcher<Record<string, SelectionStatus>>({});

/** 清空选择 */
export function clear() {
  data.setData({});
}

/** 设置选择的器件 */
export function set(input: string | string[]) {
  const ids = isArray(input) ? input : [input];
  const map: Record<string, SelectionStatus> = {};
  const els = parts.data.concat(lines.data as any) as Component[];

  function Dye(id: string) {
    const part = els.find((item) => item.id === id);

    // 器件不存在
    if (!part) {
      return;
    }

    const status = map[id];

    // 器件整个被选中
    if (status === SelectionStatus.All) {
      return;
    }

    if (part.kind === ElectronicKind.Line) {
      // 多次访问则改为整个选中
      if (status === SelectionStatus.Half) {
        map[id] = SelectionStatus.All;
        return;
      }
      // 导线两端均被选中
      else if (part.connections.every((connection) => connection.some((item) => map[item.id]))) {
        map[id] = SelectionStatus.All;
        for (const con of part.getAllConnection()) {
          Dye(con.id);
        }
      }
      else {
        map[id] = SelectionStatus.Half;
      }
    }
    else {
      // 器件必定是整体选中
      map[id] = SelectionStatus.All;
      // 搜索器件连接
      for (const con of part.getAllConnection()) {
        Dye(con.id);
      }
    }
  }

  for (const id of ids) {
    Dye(id);
  }

  console.log(map);

  data.setData(map);
}
