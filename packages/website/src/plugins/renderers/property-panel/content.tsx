// import { IStateCoreService } from '@circuit/shared';
// import { PartStructuredData } from '@circuit/types';
import React from 'react';
// import { useHook, useService } from '../../../context';
// import { IPropertyInputProps } from '../../../types';
import { EmptyPropertyPanel, SinglePropertyPanel } from './components';
import { useSelectedParts } from './utils';

export const PropertyPanelContent = React.memo(function PropertyPanelContent() {
  const { selected, isEmpty, isSingle, isSameKind } = useSelectedParts();

  if (isEmpty) {
    return <EmptyPropertyPanel />;
  }

  if (isSingle) {
    return <SinglePropertyPanel part={selected[0]} />;
  }

  if (isSameKind) {
    return <div>属性面板内容</div>;
  }

  return <div>属性面板内容</div>;
});
