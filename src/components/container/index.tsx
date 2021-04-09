import React from 'react';

import { parse } from 'qs';
import { styles } from './styles';
import { useEffect } from 'react';
import { delay } from '@utils/func';
import { load } from 'src/store';

import { DrawingSheet } from 'src/components/drawing-sheet';
import { SideMenu } from 'src/components/side-menu';

// 移除 loading 界面
function loaded() {
  const loading = document.getElementById('start-loading')!;

  loading.style.opacity = '0';
  loading.style.transition = 'opacity .5s';
  setTimeout(() => loading.remove(), 500);
  console.log('Schematic Ready.');
}

// 获取原理图信息
async function fetchMap() {
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

export function App() {
  const classNames = styles();

  useEffect(() => void fetchMap().then(loaded), []);

  return <div className={classNames.container}>
    <DrawingSheet />
    <SideMenu />
  </div>;
}
