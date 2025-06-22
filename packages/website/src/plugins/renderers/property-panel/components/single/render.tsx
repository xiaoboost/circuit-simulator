import { PartStructuredData } from '@circuit/types';
import React, { useState } from 'react';
import { Form } from '../form';
import { FormItem } from '../form-item';
import { Input } from '../input';

export interface SinglePropertyPanelProps {
  part: PartStructuredData;
}

export function SinglePropertyPanel({ part }: SinglePropertyPanelProps) {
  const [idError, setIdError] = useState('');

  return (
    <>
      <Form title='标识属性'>
        <FormItem title='编号' error={idError}>
          <Input
            property={{ kind: 'id' }}
            value={part.id}
            onError={setIdError}
            onChange={() => void 0}
          />
        </FormItem>
      </Form>
      <Form title='电气特性'>
        <FormItem title='电阻值'>
          内容
        </FormItem>
        <FormItem title='电流放大倍数'>
          内容
        </FormItem>
        <FormItem title='CE饱和压降'>
          内容
        </FormItem>
      </Form>
    </>
  );
}
