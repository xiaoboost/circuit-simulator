import { parse } from 'qs';
import { local } from '@xiao-ai/utils/web';
import { Watcher, delay } from '@xiao-ai/utils';
import { CircuitDataKey } from './constant';
import { Part, PartData, Line, LineData } from 'src/components/electronics';
import { CircuitData, ElectronicData } from './types';

export * from './types';

/** 图纸历史数据 */
export const sheetHistory = new Watcher<ElectronicData[]>([]);
/** 所有器件 */
export const parts = new Watcher<Part[]>([]);
/** 所有导线 */
export const lines = new Watcher<Line[]>([]);
/** 结束时间 */
export const end = new Watcher('10m');
/** 步长时间 */
export const step = new Watcher('10μ');
/** 示波器参数 */
export const oscilloscopes = new Watcher<string[][]>([]);

/** 加载图纸数据 */
export function loadSheet(data: ElectronicData) {
  for (const item of (data)) {
    if (item.kind === 'Line') {
      // ..
    }
    else {
      const part = new Part(item as PartData);
      part.setMark();
      parts.setData(parts.data.concat(part));
    }
  }
}

/** 加载网站数据 */
export function loadApp(data: CircuitData) {
  if (data.electronics) {
    loadSheet(data.electronics);
  }

  if (data.oscilloscopes) {
    oscilloscopes.setData(data.oscilloscopes);
  }

  if (data.simulation) {
    end.setData(data.simulation.end);
    step.setData(data.simulation.step);
  }
}

/** 获取网站数据缓存 */
export async function appDataInit() {
  const map = parse(location.search.slice(1)).map;

  let data: CircuitData | null | undefined;

  if (map) {
    const response = await import(`src/examples/${map}.ts`).catch((e) => {
      console.error(e);
    });

    if (response) {
      data = response.data;
    }
  }
  else {
    data = local.get(CircuitDataKey);
  }

  // 加载数据
  if (data) {
    loadApp(data);
    await delay(10);
  }
}
