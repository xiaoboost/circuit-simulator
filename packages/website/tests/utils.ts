import { parse } from 'qs';
import { Watcher, delay } from '@xiao-ai/utils';
import { Part, PartData, Line, LineData } from 'src/components/electronics';
import { ElectronicData } from 'src/store';

/** 加载图纸数据 */
export function loadSheet(data: ElectronicData) {
  for (const item of (data)) {
    if (item.kind === 'Line') {
      // ..
    }
    else {
      const part = new Part(item as PartData);
      part.setMark();
      // parts.setData(parts.data.concat(part));
    }
  }
}
