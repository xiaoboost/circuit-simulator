import type { IContextMenuItemVisibleProps } from '@circuit/contracts/painter';

export function visible({ hover }: IContextMenuItemVisibleProps) {
  return Boolean(hover.current.data);
}
