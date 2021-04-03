import React from 'react';

import { useEffect } from 'react';
import { delay } from '@utils/func';
import { getQueryByName } from '@utils/http';

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
  const map = getQueryByName('map');

  if (map) {
    const response = await import(`../examples/${map}.ts`).catch((e) => {
      console.error(e);
    });

    if (!response) {
      return;
    }

    // 加载数据
    // await this.$store.dispatch('IMPORT_DATA', data);
    await delay();
  }
}

export function App() {
  // 初始化
  useEffect(() => void fetchMap().then(loaded), []);

  return <>
    <DrawingSheet />
    <SideMenu />
  </>;
};
