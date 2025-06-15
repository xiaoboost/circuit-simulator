import { Debugger } from '@circuit/icons';
import { CONFIGURATION_SERVICE } from '@circuit/shared';
import { stringifyClass as sc } from '@xiao-ai/utils';
import { Tooltip, Dropdown, MenuProps } from 'antd';
import React from 'react';
import { useService, useWatcher } from '../../../../../context';
import { Button, Divider } from '../../components';
import * as Styles from './styles.less';

export function DebuggerRender() {
  const {
    openDebugLog,
    openPathSearcherDebugger,
  } = useService(CONFIGURATION_SERVICE);
  const [log, setLog] = useWatcher(openDebugLog);
  const [path, setPath] = useWatcher(openPathSearcherDebugger);

  // 非本地或者没有设置链接条件，则不渲染调试按钮
  if (
    !location.hostname.includes('localhost') &&
    !/(\?|&)debug=true(\?|&|$)/.test(location.search)
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
      label: '路径搜索器',
      isSelected: path,
      onClick: (ev: React.MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        setPath(!path);
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
        placement="top"
        trigger={['click']}
        destroyOnHidden
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
