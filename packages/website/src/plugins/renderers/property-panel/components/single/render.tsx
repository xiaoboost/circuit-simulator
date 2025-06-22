import { getPartPrototype } from '@circuit/electronics';
import { STATE_CORE_SERVICE, LOGGER_SERVICE, CONNECTION_SERVICE } from '@circuit/shared';
import { PartStructuredData, PropertyValue } from '@circuit/types';
import React, { useState, useCallback, useMemo } from 'react';
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
  const { properties } = getPartPrototype(part.kind);
  const [errors, setErrors] = useState<string[]>([]);
  const changeId = useCallback((value: string) => {
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
  }, [part.id, commit, logger, connection]);

  const changeProperty = useCallback((index: number, value: PropertyValue) => {
    const message = (
      `将器件属性"${properties[index].name}"从 `
      + `${JSON.stringify(part.propertyValues[index])} 改为 `
      + `${JSON.stringify(value)}`
    );
    logger.info(LoggerName, message);
    commit({
      name: '修改器件属性',
      description: message,
      patch({ parts }) {
        const originPart = parts.find((item) => item.id === part.id);
        if (originPart) {
          originPart.propertyValues[index] = value;
        }
      },
    });
  }, [part.id, part.propertyValues, properties, commit, logger]);
  const onError = useCallback((index: number, error: string) => {
    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = error;
      return newErrors;
    });
  }, []);
  const onChangeHandlers = useMemo(() =>
    properties.map((_, index) => (value: PropertyValue) => changeProperty(index, value)),
    [changeProperty, properties.length],
  );
  const onErrorHandlers = useMemo(() =>
    properties.map((_, index) => (error: string) => onError(index, error)),
    [onError, properties.length],
  );

  return (
    <>
      <Form title='标识属性'>
        <FormItem title='编号' error={idError}>
          <Input
            property={{ type: 'id' }}
            value={part.id}
            onError={setIdError}
            onChange={changeId}
          />
        </FormItem>
      </Form>
      <Form title='电气特性'>
        {properties.map((item, index) => (
          <FormItem title={item.name} key={item.name} error={errors[index]}>
            <Input
              property={{ type: 'params', ...item }}
              value={part.propertyValues[index]}
              onError={onErrorHandlers[index]}
              onChange={onChangeHandlers[index]}
            />
          </FormItem>
        ))}
      </Form>
    </>
  );
}
