import { STATE_CORE_SERVICE, LOGGER_SERVICE, CONNECTION_SERVICE } from '@circuit/shared';
import { PartStructuredData } from '@circuit/types';
import React, { useState } from 'react';
import { useService } from '../../../../../context';
import { Form } from '../form';
import { FormItem } from '../form-item';
import { Input } from '../input';

export interface SinglePropertyPanelProps {
  part: PartStructuredData;
}

const LoggerName = '单器件属性面板';

export function SinglePropertyPanel({ part }: SinglePropertyPanelProps) {
  const [idError, setIdError] = useState('');
  const { commit } = useService(STATE_CORE_SERVICE);
  const logger = useService(LOGGER_SERVICE);
  const connection = useService(CONNECTION_SERVICE);
  const changeId = (value: string) => {
    const message = `将器件编号从 ${part.id} 改为 ${value}`;
    logger.info(LoggerName, message);
    commit({
      name: '修改器件编号',
      description: message,
      patch({ parts }) {
        const originPart = parts.find((item) => item.id === part.id);
        if (originPart) {
          originPart.id = value;
        }
      },
    });
    connection.changeDeviceId(part.id, value);
  };

  return (
    <>
      <Form title='标识属性'>
        <FormItem title='编号' error={idError}>
          <Input
            property={{ kind: 'id' }}
            value={part.id}
            onError={setIdError}
            onChange={changeId}
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
