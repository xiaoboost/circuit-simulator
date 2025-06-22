import { allRanks, shortUnitList } from '@circuit/algorithm';
import { NumberValue, NumberPropertyDescription } from '@circuit/types';
import { Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { IPropertyInputProps } from '../../../../types';

export type Value = NumberValue;

export type Descriptor = NumberPropertyDescription & {
  type: 'params';
};

export type Props = IPropertyInputProps<Value, Descriptor>;

export function NumberInputRender({ value, onError, property, onChange }: Props) {
  const [number, setNumber] = useState(String(value.value));
  const [error, setError] = useState(false);
  const rankList = property.ranks ?? allRanks;
  const suffix = rankList.length === 1
    // 数量级只允许一个时，输入后缀为固定单位
    ? `${rankList[0]}${property.unit}`
    // 多个时为多选框
    : <Select
      options={shortUnitList(rankList, property.unit ?? '', false)}
      value={value.rank}
      onChange={(val) => {
        onChange({ ...value, rank: val });
      }}
    />;

  useEffect(() => {
    setNumber(String(value.value));
  }, [value.value]);

  const inputRules = [
    {
      rule: (val: string) => val.length > 0,
      error: '输入值不能为空',
    },
    {
      rule: (val: string) => /^-?\d*\.?\d*$/.test(val),
      error: '输入数字格式错误',
    },
  ];
  const onInput = ({ target: { value: current } }: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(current);

    for (const { rule, error } of inputRules) {
      if (!rule(current)) {
        onError?.(error);
        setError(true);
        return;
      }
    }

    onError?.('');
    setError(false);
    onChange({ ...value, value: Number(current) });
  };

  return (
    <Input
      addonAfter={suffix}
      style={{ height: '100%' }}
      value={number}
      onChange={onInput}
      status={error ? 'error' : undefined}
    />
  );
}
