import { STATE_CORE_SERVICE } from '@circuit/shared';
import { Input, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { useService } from '../../../../context';
import { IPropertyInputProps } from '../../../../types';
import * as Styles from './styles.less';

export type IdInputValue = string;

export type IdInputProps = IPropertyInputProps<IdInputValue, IdInputDescriptor>;

export interface IdInputDescriptor {
  kind: 'id';
}

export function IdInputRender({ value, onError, onChange }: IdInputProps) {
  const { state: { data: { parts } } } = useService(STATE_CORE_SERVICE);
  const partIds = parts.map(part => part.id);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [prefixError, setPrefixError] = useState(false);
  const [suffixError, setSuffixError] = useState(false);

  useEffect(() => {
    const [prefix, suffix] = value.split('_');
    setPrefix(prefix);
    setSuffix(suffix);
  }, [value]);

  const prefixRules = [
    {
      rule: (val: string) => val.length > 0,
      error: '器件编号前缀不能为空',
    },
    {
      rule: (val: string) => /^[A-Z]+$/.test(val),
      error: '器件编号前缀只允许大写字母',
    },
    {
      rule: (val: string) => !partIds.includes(`${val}_${suffix}`),
      error: '器件编号已存在',
    },
  ];
  const suffixRules = [
    {
      rule: (val: string) => val.length > 0,
      error: '器件编号前缀不能为空',
    },
    {
      rule: (val: string) => /^[a-zA-Z0-9]+$/.test(val),
      error: '器件编号前缀只允许字母和数字',
    },
    {
      rule: (val: string) => !partIds.includes(`${val}_${suffix}`),
      error: '器件编号已存在',
    },
  ];
  const onPrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrefix = e.target.value;

    setPrefix(newPrefix);

    for (const { rule, error } of prefixRules) {
      if (!rule(newPrefix)) {
        onError?.(error);
        setPrefixError(true);
        return;
      }
    }

    setPrefixError(false);
    onChange(`${newPrefix}_${suffix}`);
  };
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

    setSuffixError(false);
    onChange(`${prefix}_${newSuffix}`);
  };

  return (
    <Space.Compact style={{ height: '100%' }}>
      <Input
        placeholder="前缀"
        style={{ width: '120px' }}
        value={prefix}
        onChange={onPrefixChange}
        status={prefixError ? 'error' : undefined}
      />
      <span className={Styles.inputSplit}>-</span>
      <Input
        placeholder="编号"
        value={suffix}
        onChange={onSuffixChange}
        status={suffixError ? 'error' : undefined}
      />
    </Space.Compact>
  );
}
