import type { DrawEventController } from './controller';

export let sheetEl: HTMLElement | undefined = undefined;
export let current: DrawEventController | undefined = undefined;

export function setSheetElement(el?: typeof sheetEl) {
  sheetEl = el;
}

export function setCurrent(el?: typeof current) {
  current = el;
}
