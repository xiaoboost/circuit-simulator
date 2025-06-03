import { ElectronicKind, createPartByKind } from '@circuit/electronics';
import { Painter } from '@circuit/painter';
import React, { useCallback, useState, useMemo } from 'react';
import { ElectronicPanel } from '../electronic-panel';
import { Header } from '../header';
import { PropertyPanel } from '../property-panel';
import * as Styles from './styles.less';
import {
  useDataInit,
  usePainterState,
  useRemoveLoading,
} from './use';

export function App() {
  const data = useDataInit();
  const removeLoading = useRemoveLoading();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const painterState = usePainterState(data);
  const onCreatePart = useCallback((kind: ElectronicKind) => {
    painterState.draft((state) => {
      state.parts.push(createPartByKind(kind, state.parts));
    });
  }, [painterState.draft]);
  const selectedParts = useMemo(() => {
    return (data?.parts ?? []).filter((item) => selected.has(item.id));
  }, [selected, data?.parts]);

  return (
    <article className={Styles.layout}>
      <Header />
      <div className={Styles.container}>
        <ElectronicPanel onSelect={onCreatePart} />
        <div className={Styles.mainArea}>
        {data
          ? <Painter
            {...painterState}
            onSelect={setSelected}
            onReady={removeLoading}
          />
          : <div>Loading</div>
        }
        </div>
        <PropertyPanel selected={selectedParts} />
      </div>

    </article>
  );
}
