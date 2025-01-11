export let sheetEl: HTMLElement | undefined = undefined;

export function setSheetElement(el?: typeof sheetEl) {
  sheetEl = el;
}
