import { isLineId, ElectronicName } from '@circuit/electronics';
import { EVENT_BUS_SERVICE, STATE_CORE_SERVICE } from '@circuit/shared';
import { useEffect, useState } from 'react';
import { useService } from '../../../context';

export function PropertyPanelTitle() {
  const evBus = useService(EVENT_BUS_SERVICE);
  const stateCore = useService(STATE_CORE_SERVICE);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    return evBus.observe('SelectElectronics', (parts: Set<string>) => {
      setSelected(Array.from(parts).filter((id) => !isLineId(id)));
    });
  }, [selected]);

  if (selected.length === 0) {
    return '属性面板';
  }

  const parts = selected.map((id) => stateCore.getPart(id));

  if (parts.length === 1) {
    return ElectronicName[parts[0].kind];
  }

  const isSameKind = parts.every((part) => part.kind === parts[0].kind);

  if (isSameKind) {
    return `${ElectronicName[parts[0].kind]} ${selected.length} 个`;
  }

  return `${ElectronicName[parts[0].kind]}等 ${selected.length} 个元件`;
}
