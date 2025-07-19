import { STATE_CORE_SERVICE } from '@circuit/shared';
import { LineStructuredData, PartStructuredData } from '@circuit/types';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import {
  useComposeHOC,
  useWatcher,
  useHook,
  useService,
} from '../../../../context';
import {
  IDrawLayerProps,
  PART_RENDERER,
  LINE_RENDERER,
  SELECT_SERVICE,
} from '../../../../types';
import * as Styles from './styles.less';

function ElectronicLayerRender({ parts, lines }: IDrawLayerProps) {
  const partRenderers = useHook(PART_RENDERER, 'asc');
  const lineRenderers = useHook(LINE_RENDERER, 'asc');
  const service = useService(STATE_CORE_SERVICE);
  const selectService = useService(SELECT_SERVICE);
  const partComposedRenderers = partRenderers.map(useComposeHOC);
  const lineComposedRenderers = lineRenderers.map(useComposeHOC);
  const [selectedIds] = useWatcher(selectService.value);
  const line = (line: LineStructuredData) => (
    <g
      key={line.id}
      className={scl({
        [Styles.selected]: selectedIds.has(line.id),
      })}
    >
      {lineComposedRenderers.map(({ Component, getKey }) => {
        const props = { data: line };
        const key = getKey?.(props) ?? line.id;
        return <Component key={key} $$key={key} {...props} />;
      })}
    </g>
  );
  const part = (part: PartStructuredData) => {
    const prototype = service.getPartPrototype(part.kind);

    return (
      <g
        key={part.id}
        transform={`matrix(${part.rotate.join()},${part.position.join()})`}
        className={scl({
          [Styles.selected]: selectedIds.has(part.id),
        })}
      >
        {partComposedRenderers.map(({ Component, getKey }) => {
          const props = {
            data: part,
            prototype,
          };
          const key = getKey?.(props) ?? part.id;

          return <Component key={key} $$key={key} {...props} />;
        })}
      </g>
    );
  };

  // 如果元件和导线都没有数据，则不渲染
  if (lineComposedRenderers.length === 0 && partComposedRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {/* 未选中的元件 */}
      {parts.filter((part) => !selectedIds.has(part.id)).map(part)}
      {/* 未选中的导线 */}
      {lines.filter((line) => !selectedIds.has(line.id)).map(line)}
      {/* 选中的元件 */}
      {parts.filter((part) => selectedIds.has(part.id)).map(part)}
      {/* 选中的导线 */}
      {lines.filter((line) => selectedIds.has(line.id)).map(line)}
    </>
  );
}

export const Render = React.memo(
  ElectronicLayerRender,
  (prev, next) => {
    const { parts: prevParts, lines: prevLines } = prev;
    const { parts: nextParts, lines: nextLines } = next;
    const isSameParts = (
      prevParts.length === nextParts.length &&
      prevParts.every((part, i) => part === nextParts[i])
    );
    const isSameLines = (
      prevLines.length === nextLines.length &&
      prevLines.every((line, i) => line === nextLines[i])
    );

    return isSameParts && isSameLines;
  },
);
