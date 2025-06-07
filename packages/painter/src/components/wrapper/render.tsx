import {
  PartStructuredData,
  LineStructuredData,
} from '@circuit/electronics';
import React, { useRef } from 'react';
import { PainterContext } from '../../context/context';
import { IPainterContext } from '../../context/types';
import { CommitData, CommitCb } from '../../types';
import { Entry } from '../entry';
import { usePainterInit, usePainterUnmount } from './use';

/** 画布组件参数 */
export interface PainterProps {
  /** 画布组件的类名 */
  className?: string;
  /** 画布组件的样式 */
  style?: React.CSSProperties;
  /** 电路图的线条数据 */
  lines: LineStructuredData[];
  /** 电路图的元件数据 */
  parts: PartStructuredData[];
  /** 是否可以撤销 */
  canUndo: boolean;
  /** 是否可以重做 */
  canRedo: boolean;
  /** 撤销 */
  onUndo?(): void;
  /** 重做 */
  onRedo?(): void;
  /** 提交 */
  onCommit?(data: CommitData): void;
  /** 草稿 */
  onDraft?(data: CommitCb): void;
  /** 丢弃草稿 */
  onDropDraft?(): void;
  /** 准备就绪 */
  onReady?(): void;
  /** 选中元件 */
  onSelect?(ids: Set<string>): void;
  /** 保存缓存 */
  onSaveCache?(key: string, data: object): Promise<unknown>;
  /** 读取缓存 */
  onReadCache?(key: string): Promise<unknown>;
}

export function Painter(props: PainterProps) {
  const context = useRef<IPainterContext>({
    ServiceMap: new Map(),
    HookMap: new Map(),
    PluginUninstallers: [],
  });

  const pluginReady = usePainterInit(context.current);

  usePainterUnmount(context.current);

  if (!pluginReady) {
    return <div>Loading</div>;
  }

  return (
    <PainterContext.Provider value={context.current}>
      <Entry {...props} />
    </PainterContext.Provider>
  );
}
