import {
  STATE_CORE_SERVICE,
  STREAM_SERVICE,
  GlobalStreamConstant as Stream,
} from '@circuit/shared';
import { PartStructuredData } from '@circuit/types';
import { useEffect, useState } from 'react';
import { useService } from '../../../context';

export function useSelectedParts() {
  const [selected, setSelected] = useState<PartStructuredData[]>([]);
  const stateCore = useService(STATE_CORE_SERVICE);
  const selectedSteam = useService(STREAM_SERVICE)
    .get<Stream.SelectedChangePayload>(Stream.SelectedChange);

  useEffect(() => {
    return selectedSteam.subscribe((parts) => {
      if (parts) {
        setSelected(() => Array.from(parts).map((id) => stateCore.getPart(id)));
      }
    });
  }, []);

  return {
    selected,
    isEmpty: selected.length === 0,
    isSingle: selected.length === 1,
    isSameKind: selected.every((part) => part.kind === selected[0].kind),
  };
}
