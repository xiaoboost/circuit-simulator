import { useEffect, useState } from 'react';
import { StateData } from '../../../../types';
import { readFromCache } from './storage';

/** 数据初始化 */
export function useDataInit() {
  const [data, setData] = useState<StateData | undefined>();

  useEffect(() => {
    readFromCache().then((data) => {
      setData(data);
    });
  }, []);

  return data;
}
