import React from 'react';
import { IPropertyInputProps, IPropertyInputDescriptor } from '../../../../types';

export type IdInputValue = string;

export type IdInputProps = IPropertyInputProps<IdInputValue, IdInputDescriptor>;

export interface IdInputDescriptor extends IPropertyInputDescriptor {
  type: 'id';
}

export function IdInputRender({ property, value, onChange }: IdInputProps) {
  return <div>IdInputRender</div>;
}
