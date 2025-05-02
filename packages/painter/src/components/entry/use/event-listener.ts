import { isDef } from '@xiao-ai/utils';
import { WheelEvent, MouseEvent, useCallback } from 'react';
import { usePainterHook } from '../../../context';
import { EVENT_LISTENER_HOOK } from '../../../types';

/** 事件监听器 */
export function useEventListener() {
  const events = usePainterHook(EVENT_LISTENER_HOOK);
  const onWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
    events
      .map((event) => event.onMouseWheel)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);
  const onClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    events
      .map((event) => event.onClick)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);
  const onMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    events
      .map((event) => event.onMouseDown)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);
  const onMouseUp = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    events
      .map((event) => event.onMouseUp)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);
  const onMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    events
      .map((event) => event.onMouseMove)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);
  const onMouseEnter = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    events
      .map((event) => event.onMouseEnter)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);
  const onMouseLeave = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    events
      .map((event) => event.onMouseLeave)
      .filter(isDef)
      .forEach((cb) => cb(event));
  }, [events]);

  return {
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    onWheel,
  };
}
