import { parse } from 'qs';
import { useEffect } from 'react';
import { load } from 'src/store';
import { delay } from '@xiao-ai/utils';

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

  if (map) {
    const response = await import(`src/examples/${map}.ts`).catch((e) => {
      console.error(e);
    });

    if (!response) {
      return;
    }

    // 加载数据
    await load(response.data);
    await delay();
  }
}

/** 初始化 */
export function useInitMap() {
  useEffect(() => void fetchMapData().then(removeLoading), []);
}
