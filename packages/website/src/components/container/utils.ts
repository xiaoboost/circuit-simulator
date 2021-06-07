import { useEffect } from 'react';
import { appDataInit } from 'src/store';

/** 移除 loading 界面 */
function removeLoading() {
  const loading = document.getElementById('start-loading')!;

  loading.style.opacity = '0';
  loading.style.transition = 'opacity .5s';
  setTimeout(() => loading.remove(), 500);
  console.log('Schematic Ready.');
}

/** 初始化 */
export function useInitMap() {
  useEffect(() => void appDataInit().then(removeLoading), []);
}