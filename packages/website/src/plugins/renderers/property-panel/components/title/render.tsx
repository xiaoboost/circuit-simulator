import { ElectronicName } from '@circuit/electronics';
import { useSelectedParts } from './../../utils';

export function PropertyPanelTitle() {
  const { selected, isEmpty, isSingle, isSameKind } = useSelectedParts();

  if (isEmpty) {
    return '属性面板';
  }

  if (isSingle) {
    return ElectronicName[selected[0].kind];
  }

  if (isSameKind) {
    return `${ElectronicName[selected[0].kind]} ${selected.length} 个`;
  }

  return `${ElectronicName[selected[0].kind]}等 ${selected.length} 个元件`;
}
