import hotkeys from 'hotkeys-js';
import { useEffect, useRef } from 'react';
import { usePainterHook } from '../../../context';
import { HOT_KEY_HOOK } from '../../../types';

/** 事件监听器 */
export function useKeyboardListener() {
  const painterRef = useRef<HTMLDivElement>(null);
  const hotkey = usePainterHook(HOT_KEY_HOOK);
  const getKey = (key: string | string[]) => Array.isArray(key) ? key.join(', ') : key;

  useEffect(() => {
    if (!painterRef.current) {
      return;
    }

    hotkey.forEach(({ key, options, action }) => {
      const opt = {
        element: painterRef.current,
        ...options,
      };

      hotkeys(getKey(key), opt, action);
    });

    return () => {
      if (!painterRef.current) {
        return;
      }

      hotkey.forEach(({ key, action }) => {
        hotkeys.unbind(getKey(key), action);
      });
    };
  }, [painterRef.current]);

  return painterRef;
}
