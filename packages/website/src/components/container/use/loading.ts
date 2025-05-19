import { useEffect, useState } from 'react';
import { startLoading } from '../../../styles';

/** 移除 loading 界面 */
function removeLoading() {
  const loading = document.getElementById(startLoading);

  if (!loading) {
    return;
  }

  loading.style.opacity = '0';
  loading.style.transition = 'opacity .5s';
  setTimeout(() => loading.remove(), 500);
}

/** 移除加载界面 */
export function useRemoveLoading() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      removeLoading();
    }
  }, [ready]);

  return () => setReady(true);
}
