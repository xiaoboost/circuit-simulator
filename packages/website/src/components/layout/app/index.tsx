import { ElectronicKind, createPartByKind } from '@circuit/electronics';
import { Painter } from '@circuit/painter';
import React, { useCallback, useState, useMemo } from 'react';
import { ElectronicPanel } from '../electronic-panel';
import { Header } from '../header';
import { PropertyPanel } from '../property-panel';
import * as Styles from './styles.less';
import {
  useCache,
  useStorage,
  useRemoveLoading,
} from './use';

export function App() {
  const cache = useCache();
  const removeLoading = useRemoveLoading();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDataReady, painterState] = useStorage();
  const onCreatePart = useCallback((kind: ElectronicKind) => {
    painterState.onDraft?.((state) => {
      state.parts.push(createPartByKind(kind, state.parts));
    });
  }, [painterState.onDraft]);
  const selectedParts = useMemo(() => {
    return (painterState.parts ?? []).filter((item) => selected.has(item.id));
  }, [selected, painterState.parts]);

  return (
    <article className={Styles.layout}>
      <Header />
      <div className={Styles.container}>
        <ElectronicPanel onSelect={onCreatePart} />
        <div className={Styles.mainArea}>
        {isDataReady && cache
          ? <Painter
            {...painterState}
            onSelect={setSelected}
            onReady={removeLoading}
            onReadCache={cache.get}
            onSaveCache={cache.set}
          />
          : <div>Loading</div>
        }
        </div>
        <PropertyPanel selected={selectedParts} />
      </div>

    </article>
  );
}
