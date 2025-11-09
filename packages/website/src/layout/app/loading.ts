import { startLoadingId } from '../../styles/constant';

/** 移除 loading 界面 */
export function removeLoading() {
  const loading = document.getElementById(startLoadingId);

  if (!loading) {
    return;
  }

  loading.style.opacity = '0';
  loading.style.transition = 'opacity .5s';
  setTimeout(() => loading.remove(), 500);
}
