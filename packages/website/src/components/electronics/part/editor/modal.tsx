import React from 'react';

import { useRef, useEffect, useState } from 'react';
import { Point } from '@circuit/math';
import { delay } from '@xiao-ai/utils';
import { useWatcher } from '@xiao-ai/utils/use';
import { Map } from 'src/store';
import { styles } from './styles';

export interface PartParamEditorModalProps {
  /** 是否显示 */
  visible: boolean;
  /** 对话框位置 */
  position: Point;
}

export function PartParamEditorModal(props: React.PropsWithChildren<PartParamEditorModalProps>) {
  const {
    visible,
    position,
    children,
  } = props;
  const [map] = useWatcher(Map.state);
  const [realVisible, setRealVisible] = useState(false);
  const [positionOrigin, setPositionOrigin] = useState(Point.from([0, 0]));
  const modalRef = useRef<HTMLDivElement>(null);

  async function visibleModal(div: HTMLDivElement) {
    const positionBySheet = position.mul(map.zoom).add(map.position);
    const rect = div.getBoundingClientRect();
    const positionByPart = Point.from([
      positionBySheet[0] - rect.width / 2,
      positionBySheet[1] - rect.height - 16,
    ]);
    await delay();
    setRealVisible(true);
    setPositionOrigin(positionByPart);
  }

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    if (visible) {
      visibleModal(modalRef.current);
    }
    else {
      // TODO:
    }
  }, [visible, position]);

  return (
    <div
      ref={modalRef}
      className={styles.paramEditorModal}
      style={{
        left: positionOrigin[0],
        top: positionOrigin[1],
        opacity: realVisible ? undefined : '0',
      }}
    >
      {children}
    </div>
  );
}
