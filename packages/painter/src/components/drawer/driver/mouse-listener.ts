import { RefObject, useEffect } from 'react';
import { useHook } from '../../../context';
import { IEventListenerHook } from '../../../types';

/** 事件监听器 */
export function useMouseListener(ref: RefObject<HTMLDivElement | null>) {
  const events = useHook(IEventListenerHook);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const eventMapping = [
      { event: 'wheel', listener: 'onWheel' },
      { event: 'click', listener: 'onClick' },
      { event: 'dblclick', listener: 'onDblClick' },
      { event: 'mousedown', listener: 'onMouseDown' },
      { event: 'mouseup', listener: 'onMouseUp' },
      { event: 'mousemove', listener: 'onMouseMove' },
      { event: 'mouseenter', listener: 'onMouseEnter' },
      { event: 'mouseleave', listener: 'onMouseLeave' },
    ];

    // 按照参数组合分组事件监听器
    const eventGroups = new Map<string, { hook: IEventListenerHook; listener: string }[]>();

    for (const { event, listener } of eventMapping) {
      for (const hook of events) {
        if (hook[listener as keyof IEventListenerHook]) {
          const key = `${event}:${hook.capture ? 'capture' : ''}:${hook.passive ? 'passive' : ''}`;

          if (!eventGroups.has(key)) {
            eventGroups.set(key, []);
          }

          eventGroups.get(key)!.push({ hook, listener });
        }
      }
    }

    const cleanup: (() => void)[] = [];

    for (const [key, hooks] of eventGroups) {
      const [
        eventType, capture, passive,
      ] = key.split(':');
      const isCapture = capture === 'capture';
      const isPassive = passive === 'passive';
      const sortedHooks = hooks.sort((a, b) => (a.hook.order ?? 0) - (b.hook.order ?? 0));
      const handler = (event: Event) => {
        for (const { hook, listener } of sortedHooks) {
          const cb = hook[listener as keyof IEventListenerHook];

          if (typeof cb === 'function') {
            cb(event as any);
          }
        }
      };

      ref.current.addEventListener(eventType, handler, {
        capture: isCapture,
        passive: isPassive,
      });

      cleanup.push(() => {
        ref.current?.removeEventListener(eventType, handler, {
          capture: isCapture,
        });
      });
    }

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [ref.current, events]);
}
