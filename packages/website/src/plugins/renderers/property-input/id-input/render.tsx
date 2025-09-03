import {
  createPartReferenceTag as createPartTag,
  joinPartReferenceTag as joinPartTag,
  parsePartReferenceTag as parsePartTag,
} from '@circuit/electronics';
import { IStateCoreService } from '@circuit/shared';
import { Input } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useService } from '../../../../context';
import { IPropertyInputProps } from '../../../../types';

export type Value = string;

export type Props = IPropertyInputProps<Value, Descriptor>;

export interface Descriptor {
  type: 'referenceTag';
}

export function IdInputRender({ value, onError, onChange }: Props) {
  const { state: { data: { parts } } } = useService(IStateCoreService);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [suffixError, setSuffixError] = useState(false);
  const restPartTags = useMemo(() => {
    return parts
      .map((part) => createPartTag(part))
      .filter((id) => id !== value);
  }, [parts, value]);

  useEffect(() => {
    const [prefix, suffix] = parsePartTag(value);
    setPrefix(prefix);
    setSuffix(suffix);
  }, [value]);

  const suffixRules = [
    {
      rule: (val: string) => val.length > 0,
      error: '器件引用编号不能为空',
    },
    {
      rule: (val: string) => /^[a-zA-Z0-9]+$/.test(val),
      error: '器件引用编号只允许字母和数字',
    },
    {
      rule: (val: string) => !restPartTags.includes(joinPartTag(prefix, val)),
      error: '器件编号已存在',
    },
  ];
  const onSuffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSuffix = e.target.value;

    setSuffix(newSuffix);

    for (const { rule, error } of suffixRules) {
      if (!rule(newSuffix)) {
        onError?.(error);
        setSuffixError(true);
        return;
      }
    }

    onError?.('');
    setSuffixError(false);
    onChange(`${prefix}_${newSuffix}`);
  };

  return (
    <Input
      addonBefore={prefix}
      placeholder="请输入引用编号"
      value={suffix}
      onChange={onSuffixChange}
      status={suffixError ? 'error' : undefined}
    />
  );
}
