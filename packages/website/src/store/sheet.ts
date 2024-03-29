import { parse } from 'qs';
import { local } from '@xiao-ai/utils/web';
import { Watcher, delay } from '@xiao-ai/utils';
import { CircuitDataKey } from './constant';
import { CircuitData, ElectronicData } from './types';
import { PartData, LineData } from '@circuit/electronics';
import { PartComponent, LineComponent } from 'src/components/electronics';
import { end, step, oscilloscopes } from './config';

/** 所有器件 */
export const parts = new Watcher<PartComponent[]>([]);
/** 所有导线 */
export const lines = new Watcher<LineComponent[]>([]);

/** 加载图纸数据 */
export function loadSheet(data: ElectronicData) {
  data
    .filter((item) => item.kind !== 'Line')
    .forEach((item) => {
      const part = new PartComponent(item as PartData);
      part.setMark();
    });

  data
    .filter((item) => item.kind === 'Line')
    .forEach((item) => {
      const line = new LineComponent((item as LineData).path);
      line.setConnectionByPath(false);
      line.setMark();
    });
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
