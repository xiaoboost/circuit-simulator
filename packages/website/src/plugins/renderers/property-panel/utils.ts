import {
  IStateCoreService,
  IStreamService,
  GlobalStream as Stream,
} from '@circuit/contracts/global';
import { PartStructuredData } from '@circuit/types';
import { useEffect, useState } from 'react';
import { useService } from '../../../context';

export function useSelectedParts() {
  const [selected, setSelected] = useState<PartStructuredData[]>([]);
  const stateCore = useService(IStateCoreService);
  const selectedSteam = useService(IStreamService)
    .get<Stream.SelectedChangePayload>(Stream.SelectedChange);

  useEffect(() => {
    return selectedSteam.subscribe((electronics) => {
      if (electronics) {
        setSelected(() => stateCore.state.data.parts.filter((part) => electronics.has(part.id)));
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
