import { isPartId } from '@circuit/electronics';
import type { IContextMenuItemVisibleProps } from '../../../../types';

export function visible({ select }: IContextMenuItemVisibleProps) {
  const selectedIds = Array.from(select.value.data.keys());
  const isSinglePart = selectedIds.length === 1 && isPartId(selectedIds[0]);
  return isSinglePart;
}
