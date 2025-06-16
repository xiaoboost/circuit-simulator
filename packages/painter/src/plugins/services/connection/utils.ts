import { type Point } from '@circuit/algorithm';
import { type ElectronicsStructuredData, getPartPins } from '@circuit/electronics';
import { type IConnectionData } from '../../../types';

/** 记录所有器件的引脚位置 */
export function getConnections({ parts, lines }: ElectronicsStructuredData) {
  const pinMap = new Map<string, IConnectionData[]>();
  const setPin = (position: Point, pin: IConnectionData) => {
    if (!pinMap.has(position.join())) {
      pinMap.set(position.join(), []);
    }

    pinMap.get(position.join())!.push(pin);
  };

  for (const part of parts) {
    for (const pin of getPartPins(part)) {
      setPin(pin.position, {
        id: part.id,
        index: pin.index,
      });
    }
  }

  for (const line of lines) {
    const points = [line.path[0], line.path[line.path.length - 1]];
    for (let i = 0; i < points.length; i++) {
      setPin(points[i], {
        id: line.id,
        index: i,
      });
    }
  }

  return Array.from(pinMap.values());
}
