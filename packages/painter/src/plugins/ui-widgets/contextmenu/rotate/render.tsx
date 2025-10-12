import {
  RotateMatrixSet,
  Rotate,
  RotateDisplayNameSet,
  preMatrixMultiply,
  DirectionVectorSet,
  rotateVector,
} from '@circuit/algorithm';
import { createPartReferenceTag } from '@circuit/electronics';
import {
  RotateRightOutlined,
  RotateLeftOutlined,
  FlipHorizontally,
  FlipVertically,
} from '@circuit/icons';
import { IStateCoreService, ILoggerService } from '@circuit/shared';
import React, { useCallback } from 'react';
import { useService } from '../../../../context';
import {
  ICollisionService,
  IMapHashService,
  ISelectService,
  IContextMenuService,
  IContextMenuItemProps,
} from '../../../../types';
import { Dropdown } from '../components';

const LoggerName = '旋转器件';

export function RotateRender(props: IContextMenuItemProps) {
  const selectService = useService(ISelectService);
  const selectedIds = Array.from(selectService.value.data.keys());
  const stateCoreService = useService(IStateCoreService);
  const loggerService = useService(ILoggerService);
  const contextMenuService = useService(IContextMenuService);
  const mapHashService = useService(IMapHashService);
  const collisionService = useService(ICollisionService);
  const transformDirection = useCallback((value: Rotate) => {
    const partId = selectedIds[0];
    const oldPart = stateCoreService.getPart(partId);
    const partTag = createPartReferenceTag(oldPart);
    const message = `${RotateDisplayNameSet[value]}器件 ${partTag}`;

    // FIXME: 目前只有一个器件，所以直接旋转即可，这里还要判断器件能否旋转，以及旋转后的位置是否合法

    loggerService.info(LoggerName, message);
    contextMenuService.close();
    mapHashService.removeMark(oldPart);
    collisionService.removeEntity(partId);

    stateCoreService.commit({
      name: '旋转器件',
      description: message,
      patch: ({ parts }) => {
        const originPart = parts.find((item) => item.id === partId);

        if (originPart) {
          const transformMatrix = RotateMatrixSet[value];
          const oldRotate = originPart.rotate;
          const newRotate = preMatrixMultiply(oldRotate, transformMatrix);
          const directionVector = rotateVector(
            DirectionVectorSet[originPart.textDirection],
            transformMatrix,
          );

          originPart.rotate = newRotate;
          originPart.textDirection = directionVector.toDirection();
        }
      },
    });

    const newPart = stateCoreService.getPart(partId);
    mapHashService.setMark(newPart);
    collisionService.setEntity(newPart);
    console.log(newPart);
  }, []);

  return (
    <Dropdown
      name={props.name}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      list={[
        {
          key: Rotate.Clockwise,
          icon: <RotateRightOutlined />,
          children: RotateDisplayNameSet[Rotate.Clockwise],
        },
        {
          key: Rotate.AntiClockwise,
          icon: <RotateLeftOutlined />,
          children: RotateDisplayNameSet[Rotate.AntiClockwise],
        },
        {
          key: Rotate.XAxis,
          icon: <FlipHorizontally />,
          children: RotateDisplayNameSet[Rotate.XAxis],
        },
        {
          key: Rotate.YAxis,
          icon: <FlipVertically />,
          children: RotateDisplayNameSet[Rotate.YAxis],
        },
      ]}
      icon={<RotateRightOutlined />}
      onClickItem={transformDirection}
    >
      几何变换
    </Dropdown>
  );
}
