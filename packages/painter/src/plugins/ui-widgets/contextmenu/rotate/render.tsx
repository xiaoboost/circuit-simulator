import { isPartId } from '@circuit/electronics';
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
  IHoverService,
  ICollisionService,
  IConnectionService,
  IMapHashService,
  ISelectService,
  ICursorService,
  IContextMenuService,
} from '../../../../types';
import { Dropdown } from '../components';

enum TransformDirection {
  Right = 'rotateRight',
  Left = 'rotateLeft',
  Horizontally = 'horizontally',
  Vertically = 'vertically',
}

export function RotateRender() {
  const selectService = useService(ISelectService);
  const selectedIds = Array.from(selectService.value.data.keys());
  const isSinglePart = selectedIds.length === 1 && isPartId(selectedIds[0]);

  // debugger;

  if (!isSinglePart) {
    return null;
  }

  return (
    <Dropdown
      list={[
        {
          key: TransformDirection.Right,
          icon: <RotateRightOutlined />,
          children: '顺时针旋转',
        },
        {
          key: TransformDirection.Left,
          icon: <RotateLeftOutlined />,
          children: '逆时针旋转',
        },
        {
          key: TransformDirection.Horizontally,
          icon: <FlipHorizontally />,
          children: '水平翻转',
        },
        {
          key: TransformDirection.Vertically,
          icon: <FlipVertically />,
          children: '垂直翻转',
        },
      ]}
      icon={<RotateRightOutlined />}
      onClickItem={(value) => {
        console.log(value);
        debugger;
      }}
    >
      几何变换
    </Dropdown>
  );
}
