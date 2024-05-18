import React from 'react';

import { Point } from '@circuit/math';
import { useWatcher } from '@xiao-ai/utils/use';
import { Map } from 'src/store';
import { styles } from './styles';

export interface PartParamEditorModalProps {
  /** 对话框位置 */
  position: Point;
  /** 是否显示 */
  visible: boolean;
}

export function PartParamEditorModal({ position, children }: React.PropsWithChildren<PartParamEditorModalProps>) {
  const [map] = useWatcher(Map.state);
  const positionBySheet = position.mul(map.zoom).add(map.position);

  return (
    <div
      className={styles.paramEditorModal}
      style={{
        left: positionBySheet[0],
        top: positionBySheet[1],
      }}
    >
      {children}
    </div>
  );
}
