import { IPropertyInput, type IPropertyInputProps } from '@circuit/contracts/global';
import debounce from 'debounce';
import React, { useMemo } from 'react';
import { useHook } from '../../../../../context';

export interface FormItemProps {
  title: string;
  children: React.ReactNode;
}

export function Input<
  T = any,
  D extends object = object,
>({ onChange, onError, ...rest }: IPropertyInputProps<T, D>) {
  const inputs = useHook(IPropertyInput);
  const onDebounceChange = useMemo(() => debounce(onChange, 500), [onChange]);
  const onDebounceError = useMemo(() => debounce(onError ?? (() => void 0), 500), [onError]);
  const input = inputs.find((input) => input.match(rest.property));

  if (input) {
    return <input.Render {...rest} onChange={onDebounceChange} onError={onDebounceError} />;
  }
}
