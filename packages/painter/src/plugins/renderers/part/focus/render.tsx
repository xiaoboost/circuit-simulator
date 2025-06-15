import React from 'react';
import { useService } from '../../../../context';
import { IPartRendererProps, DRAG_SCENE_SERVICE } from '../../../../types';
import * as Styles from './styles.less';

function PartFocusRender({ data, prototype }: IPartRendererProps) {
  const dragService = useService(DRAG_SCENE_SERVICE);
  const onMouseDown = React.useCallback((event: React.MouseEvent<SVGGElement>) => {
    // 非左键不处理
    if (event.button !== 0) {
      return;
    }

    // 事件互斥
    if (dragService.size !== 0) {
      return;
    }

    dragService.trigger('move-part-label', {
      id: data.id,
      event,
    });
  }, [dragService]);

  return (
    <g
      className={Styles.focus}
      onClick={onMouseDown}
    >
      {prototype.focus.map(({ name: Tag, attribute }, index) => (
        <Tag key={index} {...attribute} />
      ))}
    </g>
  );
}

export const Render = React.memo(PartFocusRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
