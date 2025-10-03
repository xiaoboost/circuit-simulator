import type { IContextMenuItemVisibleProps } from '../../../../types';

export function visible({ hover }: IContextMenuItemVisibleProps) {
  return Boolean(hover.status.data);
}
