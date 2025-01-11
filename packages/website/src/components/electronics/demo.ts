import React from 'react';
import type { Point } from '@circuit/math';
import type { MouseButtons } from '@xiao-ai/utils/web';

interface DrawEventBusInitParam {
  elementRef: React.Ref<HTMLElement>;
  mousemove(event: React.MouseEvent): void;
  mouseEnterPart(id: string): void;
  mouseLeavePart(id: string): void;
  mouseEnterLine(id: string): void;
  mouseLeaveLine(id: string): void;
}

interface MoveEvent {

}

interface MoveController {
  setCursor(): void;
}

interface StopEventOption {
  type: 'click' | 'dblclick' | 'mousedown' | 'mouseup';
  which: keyof typeof MouseButtons;
}

interface DrawEventBus {
  onMove(event: MoveEvent, controller: MoveController): DrawEventBus;
  onEnd(opt: StopEventOption): DrawEventBus;
  run(): Promise<void>;
}

declare function useDrawEventBusInit(params: DrawEventBusInitParam): void;

declare function useDrawEvent(): DrawEventBus;
