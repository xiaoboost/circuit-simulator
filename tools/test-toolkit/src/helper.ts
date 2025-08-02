/**
 * 等待状态变化
 * @param getValues 获取当前状态的函数
 * @param timeout 超时时间
 * @returns 返回当前状态
 */
export function waitForStateChange<T>(
  getValues: () => T,
  timeout = 1000,
) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const initialValues = getValues();
    const interval = 20;
    const timer = setInterval(() => {
      const values = getValues();
      if (values !== initialValues) {
        clearInterval(interval);
        resolve(values);
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(timer);
        reject(new Error('Timeout waiting for state change'));
      }
    }, interval);
  });
}

/**
 * 等待状态变化
 * @param getValues 获取当前状态的函数
 * @param timeout 超时时间
 * @returns 返回当前状态
 */
export function waitForStateBe<T>(
  getValues: () => T,
  value: T,
  timeout = 1000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const initialValues = getValues();

    if (initialValues === value) {
      resolve(initialValues);
      return;
    }

    const interval = 20;
    const timer = setInterval(() => {
      const values = getValues();
      if (values === value) {
        clearInterval(interval);
        resolve(values);
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(timer);
        reject(new Error('Timeout waiting for state change'));
      }
    }, interval);
  });
}
