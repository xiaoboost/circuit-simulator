import { useEffect } from 'react';
import { Sheet } from 'src/store';

/** 移除 loading 界面 */
function removeLoading() {
  const loading = document.getElementById('start-loading');

  if (!loading) {
    return;
  }

  loading.style.opacity = '0';
  loading.style.transition = 'opacity .5s';
  setTimeout(() => loading.remove(), 500);
  console.log('Schematic Ready.');
}

/** 初始化 */
export function useInit() {
  useEffect(() => void Sheet.appDataInit().then(removeLoading), []);
}
