import { useState, useEffect, useMemo } from 'react';

import { Point } from 'src/math';
import { DrawController } from 'src/lib/mouse';
import { Part, Electronics } from 'src/electronics';
import { delay } from '@utils/func';

interface PartPoint {
  /** 节点半径 */
  size: number;
  /** 节点样式名称 */
  className: string;
  /** 原本节点相对器件原点位置 */
  origin: Point;
  /** 现在节点相对器件原点位置 */
  position: Point;
  /** 节点向外的延申方向 */
  direction: Point;
}

export function usePoints(part: Part) {
  const [points, setPoints] = useState<PartPoint[]>([]);

  useEffect(() => {
    setPoints(Array.from(part.connectPoints()).map((point) => ({
      ...point,
      size: -1,
      className: '',
    })));
  }, [part.rotate, part.connects]);

  return points;
}

export function useTexts(data: Part) {
  return useMemo(() => (
    data.params
      .map((v, i) => ({ ...Electronics[data.kind].params[i], value: v }))
      .filter((txt) => txt.vision)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ'))
  ), [data.params]);
}

export function useCreateStatus(data: Part) {
  useEffect(() => {
    if (!data.isCreate) {
      return;
    }

    // 选中自己
    data.setSelects([data.id]);

    new DrawController()
      // .setCursor('move_part')
      .setStopEvent({ type: 'mousedown', which: 'Left' })
      .setMoveEvent((e) => {
        data.position = e.position;
        data.dispatch();
      })
      .start()
      .then(() => {
        const node = data.position;

        data.position = Point.from(
          node.round(20)
            .around((point) => !data.isOccupied(point), 20)
            .reduce(
              (pre, next) =>
                node.distance(pre) < node.distance(next) ? pre : next,
            ),
        );

        data.setSign();
        data.dispatch();

        delay(6).then(() => data.isCreate = false);
      });
  }, []);
}
