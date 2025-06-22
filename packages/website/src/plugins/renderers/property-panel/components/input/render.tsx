import React from 'react';
import { useHook } from '../../../../../context';
import { PROPERTY_INPUT, type IPropertyInputProps } from '../../../../../types';

export interface FormItemProps {
  title: string;
  children: React.ReactNode;
}

export function Input<T = any, D extends object = object>(props: IPropertyInputProps<T, D>) {
  const inputs = useHook(PROPERTY_INPUT);
  const input = inputs.find((input) => input.match(props.property));

  if (input) {
    return <input.Render {...props} />;
  }
}
