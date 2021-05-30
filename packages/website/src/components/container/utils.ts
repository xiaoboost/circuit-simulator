import { parse } from 'qs';
import { useEffect } from 'react';
import { delay } from '@xiao-ai/utils';
import { local } from '@xiao-ai/utils/web';
import { CircuitDataKey } from 'src/lib/constant';
import { SimulationConfig } from 'src/components/side-menu';
import { PartData, LineData, Part, Line, dispatch } from 'src/components/electronics';

/** 电路数据 */
export interface CircuitData {
  time?: SimulationConfig;
  oscilloscopes?: string[][];
  electronics?: (PartData | LineData)[];
}

/** 移除 loading 界面 */
function removeLoading() {
  const loading = document.getElementById('start-loading')!;

  loading.style.opacity = '0';
  loading.style.transition = 'opacity .5s';
  setTimeout(() => loading.remove(), 500);
  console.log('Schematic Ready.');
}

/** 获取原理图信息 */
async function fetchMapData() {
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
    await load(data);
    await delay();
  }
}

/** 加载数据 */
async function load(data: CircuitData) {
  // 加载期间
  for (const item of (data.electronics ?? [])) {
    if (item.kind === 'Line') {
      // ..
    }
    else {
      new Part(item as PartData).setSign();
    }
  }
  
  dispatch();
}

/** 初始化 */
export function useInitMap() {
  useEffect(() => void fetchMapData().then(removeLoading), []);
}
