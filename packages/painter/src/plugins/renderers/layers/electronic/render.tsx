import { getPartPrototype } from '@circuit/electronics';
import React from 'react';
import { useWatcher, useService } from '../../../../context';
import { IDrawLayerProps, SELECT_SERVICE } from '../../../../types';
import { Line } from './line';
import { Part } from './part';

function ElectronicLayerRender({ parts, lines }: IDrawLayerProps) {
  const selectService = useService(SELECT_SERVICE);
  const [selectedIds] = useWatcher(selectService.value);

  // 如果元件和导线都没有数据，则不渲染
  if (parts.length === 0 && lines.length === 0) {
    return null;
  }

  return (
    <g>
      {/* 未选中的元件 */}
      {...parts
        .filter((part) => !selectedIds.has(part.id))
        .map((part) => <Part key={part.id} data={part} prototype={getPartPrototype(part.kind)} />)}
      {/* 未选中的导线 */}
      {...lines
        .filter((line) => !selectedIds.has(line.id))
        .map((line) => <Line key={line.id} data={line} />)}
      {/* 选中的元件 */}
      {...parts
        .filter((part) => selectedIds.has(part.id))
        .map((part) => <Part key={part.id} data={part} prototype={getPartPrototype(part.kind)} />)}
      {/* 选中的导线 */}
      {...lines
        .filter((line) => selectedIds.has(line.id))
        .map((line) => <Line key={line.id} data={line} />)}
    </g>
  );
}

export const Render = React.memo(
  ElectronicLayerRender,
  (prev, next) => {
    const { parts: prevParts, lines: prevLines } = prev;
    const { parts: nextParts, lines: nextLines } = next;
    const isSameParts = (
      prevParts.length === nextParts.length
      && prevParts.every((part, i) => part === nextParts[i])
    );
    const isSameLines = (
      prevLines.length === nextLines.length
      && prevLines.every((line, i) => line === nextLines[i])
    );

    return isSameParts && isSameLines;
  },
);
