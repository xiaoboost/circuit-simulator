import React from 'react';

import { useRef, useEffect, useState } from 'react';
import { Point } from '@circuit/math';
import { delay, stringifyClass } from '@xiao-ai/utils';
import { useWatcher } from '@xiao-ai/utils/use';
import { Map } from 'src/store';
import { styles } from './styles';

export interface PartParamEditorModalProps {
  /** 是否显示 */
  visible: boolean;
  /** 对话框位置 */
  position: Point;
  /** 强制关闭对话框 */
  onForceClose?(): void;
}

export function PartParamEditorModal(props: React.PropsWithChildren<PartParamEditorModalProps>) {
  const {
    visible,
    position,
    children,
    onForceClose,
  } = props;
  const [map] = useWatcher(Map.state);
  const [realVisible, setRealVisible] = useState(false);
  const [isModalTop, setIsModalTop] = useState(true);
  const [triangleTransform, setTriangleTransform] = useState(0);
  const [positionOrigin, setPositionOrigin] = useState(Point.from([0, 0]));
  const modalRef = useRef<HTMLDivElement>(null);

  async function visibleModal(modal: HTMLDivElement, map: Map.State) {
    const positionByScreen = position.mul(map.zoom).add(map.position);

    // 超出屏幕强制关闭
    if (
      positionByScreen[0] < 0 ||
      positionByScreen[1] < 0
      // TODO: 右下角怎么处理
    ) {
      onForceClose?.();
      return;
    }

    let triangleLeftTransform = 0;
    let modalYBias = 16;
    let isModalTop = true;

    const modalRect = modal.getBoundingClientRect();
    const positionByPartLocateLeftTop = Point.from([
      positionByScreen[0] - modalRect.width / 2,
      positionByScreen[1] - modalRect.height - modalYBias,
    ]);

    // 左侧
    if (positionByPartLocateLeftTop[0] < 0) {
      triangleLeftTransform = positionByPartLocateLeftTop[0];
      positionByPartLocateLeftTop[0] = 0;
    }

    // 上侧
    if (positionByPartLocateLeftTop[1] < 0) {
      isModalTop = false;
      positionByPartLocateLeftTop[1] = positionByScreen[1] + modalYBias;
    }

    await delay();
    setRealVisible(true);
    setTriangleTransform(triangleLeftTransform);
    setIsModalTop(isModalTop);
    setPositionOrigin(positionByPartLocateLeftTop);
  }

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    if (visible) {
      visibleModal(modalRef.current, map);
    }
    else {
      // TODO:
    }
  }, [visible, position, map]);

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
      {isModalTop
        ? ''
        : <aside
          className={stringifyClass(styles.dialogTriangle, styles.dialogTriangleTop)}
          style={{ transform: `translateX(${triangleTransform}px)` }}
        />
      }
      {children}
      {isModalTop
        ? <aside
          className={styles.dialogTriangle}
          style={{ transform: `translateX(${triangleTransform}px)` }}
        />
        : ''
      }
    </div>
  );
}
