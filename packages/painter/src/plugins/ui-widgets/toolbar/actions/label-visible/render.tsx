import { Text } from '@circuit/icons';
import { CONFIGURATION_SERVICE } from '@circuit/shared';
import { Tooltip, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../../context';
import { Button } from '../../components';
import * as Styles from './styles.less';

export function LabelVisibleRender() {
  const {
    PartLabelVisibleKind: Kind,
    partLabelVisible: visible,
  } = useService(CONFIGURATION_SERVICE);
  const [labelVisible, setLabelVisible] = useWatcher(visible);

  const items: MenuProps['items'] = [
    {
      key: Kind.Visible,
      label: '显示器件信息',
    },
    {
      key: Kind.OnlyId,
      label: '仅显示标识符',
    },
    {
      key: Kind.OnlyParam,
      label: '仅显示参数',
    },
    {
      key: Kind.NotVisible,
      label: '隐藏器件信息',
    },
  ];
  const selectedKeys = items
    .filter((item) => item?.key === labelVisible)
    .map((item) => String(item?.key));

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        defaultSelectedKeys: selectedKeys,
        onSelect: ({ key }) => {
          setLabelVisible(Number(key));
        },
      }}
      placement="top"
      trigger={['click']}
      destroyOnHidden
      overlayClassName={Styles.menuDropList}
    >
      <Tooltip title="器件信息配置" placement="bottom" destroyOnHidden>
        <Button>
          <Text />
        </Button>
      </Tooltip>
    </Dropdown>
  );
}
