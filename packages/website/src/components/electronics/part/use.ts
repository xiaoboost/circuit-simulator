import { useEffect } from 'react';
import { Point } from '@circuit/math';
import { DrawEventController } from '@circuit/event';
import { PartProps } from './part';

/** 器件创建时 */
export function usePartCreated(props: PartProps, forceUpdate: () => void) {
  const {
    instance,
    onBeforeCreate,
    onCreated,
    onDeleted,
  } = props;

  useEffect(() => {
    // 新建器件
    if (!instance.position.isEqual([1e6, 1e6])) {
      return;
    }

    // 选中自己
    onBeforeCreate?.(instance.id);

    DrawEventController.create()
      .setCursor('move_part')
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent((e) => {
        instance.position = e.position;
        forceUpdate();
      })
      .start()
      .then(() => {
        // 创建之后未移动，需要删除
        if (instance.position.isEqual([1e6, 1e6])) {
          onDeleted?.(instance.id);
          return;
        }

        // 创建之后放下器件
        const node = instance.position;

        instance.position = Point.from(
          node.round(20)
            .around((point) => !instance.isOccupied(point.add(instance.position, -1)), 20)
            .reduce(
              (pre, next) =>
                node.distance(pre) < node.distance(next) ? pre : next,
            ),
        );

        instance.setMark();

        onCreated?.(instance.id);
        forceUpdate();
      });
  }, []);
}
