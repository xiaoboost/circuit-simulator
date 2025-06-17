import { EVENT_BUS_SERVICE, STATE_CORE_SERVICE, EventBusEvent } from '@circuit/shared';
import { PartStructuredData } from '@circuit/types';
import { useEffect, useState } from 'react';
import { useService } from '../../../context';

export function useSelectedParts() {
  const [selected, setSelected] = useState<PartStructuredData[]>([]);
  const stateCore = useService(STATE_CORE_SERVICE);
  const eventBus = useService(EVENT_BUS_SERVICE);

  useEffect(() => {
    return eventBus.observe(EventBusEvent.SELECT_ELECTRONICS, (parts: Set<string>) => {
      setSelected(() => Array.from(parts).map((id) => stateCore.getPart(id)));
    });
  }, []);

  return {
    selected,
    isEmpty: selected.length === 0,
    isSingle: selected.length === 1,
    isSameKind: selected.every((part) => part.kind === selected[0].kind),
  };
}
