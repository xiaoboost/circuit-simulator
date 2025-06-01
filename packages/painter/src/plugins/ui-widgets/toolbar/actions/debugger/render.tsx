import { stringifyClass as sc } from '@xiao-ai/utils';
import { Dropdown, MenuProps } from 'antd';
import React from 'react';
import { usePainterService, useWatcher } from '../../../../../context';
import { CONFIGURATION_SERVICE } from '../../../../../types';
import { Button, Divider, Check } from '../../components';
import * as Styles from './styles.less';

export function DebuggerRender() {
  const {
    openDebugLog,
    openPathSearcherDebugger,
  } = usePainterService(CONFIGURATION_SERVICE);
  const [log, setLog] = useWatcher(openDebugLog);
  const [path, setPath] = useWatcher(openPathSearcherDebugger);

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
        className={sc(Styles.menuItem, {
          [Styles.selected]: item.isSelected,
        })}
        onClick={item.onClick}
      >
        <span>{item.label}</span>
        {item.isSelected ? <Check /> : <span />}
      </div>
    ),
  }));

  // 非本地或者没有设置链接条件，则不渲染调试按钮
  if (
    !location.hostname.includes('localhost') &&
    !/(\?|&)debug=true(\?|&|$)/.test(location.search)
  ) {
    return null;
  }

  return (
    <>
      <Dropdown
        menu={{ items }}
        placement="top"
        trigger={['click']}
        destroyOnHidden
        overlayClassName={Styles.menuDropList}
      >
        <Button
          style={{
            marginRight: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            transform="scale(1.2)"
          >
            {/* eslint-disable-next-line */}
            <path d="M480-200q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Zm0 320q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Z" />
          </svg>
        </Button>
      </Dropdown>
      <Divider />
    </>
  );
}
