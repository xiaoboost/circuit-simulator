import { EVENT_BUS_SERVICE, STATE_CORE_SERVICE, EventBusEvent } from '@circuit/shared';
import { PartStructuredData } from '@circuit/types';
import React, { useEffect, useState } from 'react';
import { useHook, useService } from '../../../context';
import { PROPERTY_INPUT } from '../../../types';
import { EmptyPropertyPanel, SinglePropertyPanel } from './components';
import { useSelectedParts } from './utils';

export function PropertyPanelContent() {
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
}
