import { Debugger } from '@circuit/icons';
import { IConfigurationService } from '@circuit/shared';
import { stringifyClass as sc } from '@xiao-ai/utils';
import { Tooltip, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../context';
import { IPainterConfigurationService } from '../../../../types';
import { Button, Divider } from '../components';
import { ToolbarMenuOffset } from '../constant';
import * as Styles from './styles.less';

export function DebuggerRender() {
  const {
    openDebugLog,
  } = useService(IConfigurationService);
  const {
    openMapMarkDebugger,
    openLineSearchDebugger,
    visibleElectronicOutline,
  } = useService(IPainterConfigurationService);
  const [log, setLog] = useWatcher(openDebugLog);
  const [mapMark, setMapMark] = useWatcher(openMapMarkDebugger);
  const [lineSearch, setLineSearch] = useWatcher(openLineSearchDebugger);
  const [electronicOutline, setElectronicOutline] = useWatcher(visibleElectronicOutline);

  // 非本地或者没有设置链接条件，则不显示调试按钮
  if (
    !location.hostname.includes('localhost')
    && !/(\?|&)debug=true(\?|&|$)/.test(location.search)
  ) {
    return null;
  }

  const list = [
    {
      key: '1',
      label: '调试日志',
      isSelected: log,
      onClick: (ev: React.MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        setLog(!log);
      },
    },
    {
      key: '2',
      label: '图纸标记',
      isSelected: mapMark,
      onClick: (ev: React.MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        setMapMark(!mapMark);
      },
    },
    {
      key: '3',
      label: '导线搜索器',
      isSelected: lineSearch,
      onClick: (ev: React.MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        setLineSearch(!lineSearch);
      },
    },
    {
      key: '4',
      label: '元件外边框',
      isSelected: electronicOutline,
      onClick: (ev: React.MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        setElectronicOutline(!electronicOutline);
      },
    },
  ];
  const items: MenuProps['items'] = list.map((item) => ({
    key: item.key,
    label: (
      <div
        onClick={item.onClick}
        className={sc(Styles.menuItem, {
          [Styles.selected]: item.isSelected,
        })}
      >
        {item.label}
      </div>
    ),
  }));

  return (
    <>
      <Dropdown
        menu={{ items }}
        placement="topLeft"
        trigger={['click']}
        destroyOnHidden
        align={{
          offset: [0, -ToolbarMenuOffset],
        }}
        overlayClassName={Styles.menuDropList}
      >
        <Tooltip title="调试选项" placement="bottom" destroyOnHidden>
          <Button
            style={{
              marginRight: 0,
            }}
          >
            <Debugger />
          </Button>
        </Tooltip>
      </Dropdown>
      <Divider />
    </>
  );
}
