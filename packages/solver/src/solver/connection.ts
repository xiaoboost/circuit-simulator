import type { ConnectionData } from '@circuit/electronics';

const pinSplitMark = ':';
const insidePinMark = '@';

export function stringifyPin(id: string, mark: number) {
  return `${id}${pinSplitMark}${mark}`;
}

export function parse(pin: string): ConnectionData {
  const [id, mark] = pin.split(pinSplitMark);
  return {
    id,
    mark: mark ? Number.parseInt(mark) : -1,
  };
}

export function stringifyInsidePin(id: string, data2: ConnectionData) {
  return `${id}${insidePinMark}${stringifyPin(data2.id, data2.mark)}`;
}

export function stringifyInsidePart(id: string, insideId: string) {
  return `${id}${insidePinMark}${insideId}`;
}
