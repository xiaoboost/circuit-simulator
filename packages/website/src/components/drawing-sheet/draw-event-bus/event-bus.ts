import type { DrawEventBus, DrawEvent, StopEventOption } from './types';

export function setDrawEvent(): DrawEventBus {
  function onMove(event: DrawEvent): DrawEventBus {
    return drawEventBus;
  }

  function onEnd(opt: StopEventOption): DrawEventBus {
    return drawEventBus;
  }

  function run(): Promise<void> {

  }

  const drawEventBus = {
    onMove,
    onEnd,
    run,
  };

  return drawEventBus;
}
