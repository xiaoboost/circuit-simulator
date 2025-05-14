import { PointLike } from '@circuit/algorithm';
import { MarkMap } from '@circuit/map';
import { IPinConnection } from '../../../../types';

export function getPinConnectionByPosition(
  position: PointLike,
  service: MarkMap,
): IPinConnection[] {
  const mark = service.get(position);
  const errorMessage = `无法获取节点连接，请检查节点位置是否正确: ${position.join()}`;

  if (!mark) {
    throw new Error(errorMessage);
  }

  if (mark.isPartPin()) {
    return [
      {
        id: mark.part,
        pin: mark.pin,
      },
    ];
  }
  else if (mark.isPartPinLine()) {
    return [
      {
        id: mark.part,
        pin: mark.pin,
      },
      {
        id: mark.line,
      },
    ];
  }
  else if (mark.isLinePoint()) {
    return [
      {
        id: mark.line,
      },
    ];
  }
  else if (mark.isLineCross()) {
    return mark.lines.map((item) => ({
      id: item,
    }));
  }
  else {
    throw new Error(errorMessage);
  }
}
