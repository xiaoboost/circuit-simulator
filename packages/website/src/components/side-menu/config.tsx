import React from 'react';

import { config } from './styles';
import { Panel } from './components/panel';
import { ElectronicKind } from 'src/components/electronics';
import { shortUnitList, NumberRank, SelectList, splitNumber } from '@circuit/math';
import { InputNumber, Select, Input, Button, Row, Col, Modal } from 'antd';
import { parts, end, step, oscilloscopes } from 'src/store';

import { Watcher } from '@xiao-ai/utils';
import { useWatcher, useWatcherList, useForceUpdate } from '@xiao-ai/utils/use';
import { CloseCircleOutlined } from '@ant-design/icons';

import { PropsWithChildren, useState, useMemo, useEffect, useRef } from 'react';

/** 结束时间单位选择 */
const endTimeUnits = shortUnitList(['', 'm', 'μ'], '秒', true);
/** 步长时间单位选择 */
const stepTimeUnits = shortUnitList(['m', 'μ', 'n', 'p'], '秒', true);

function useWatcherTime(watcher: Watcher<string>) {
  const update = useForceUpdate();
  const { current: state } = useRef({
    value: 0,
    unit: '' as NumberRank,
  });

  function setValue(val: number) {
    state.value = val;
    watcher.setData(`${val}${state.unit}`);
    update();
  }

  function setUnit(val: NumberRank) {
    state.unit = val;
    watcher.setData(`${state.value}${val}`);
    update();
  }
  
  function handleChange(val: string) {
    const result = splitNumber(val);
    setValue(Number.parseInt(result.number));
    setUnit(result.rank);
  }

  useEffect(() => {
    handleChange(watcher.data)
    watcher.observe(handleChange);
    return () => watcher.unObserve(handleChange);
  }, []);

  return {
    value: state.value,
    unit: state.unit,
    setValue,
    setUnit,
  };
}

interface SectionProps {
  title: string;
}

interface TimeFormItemProps {
  label: string;
  value: number;
  unit: NumberRank;
  unitList: SelectList;
  onChangeValue: (val: number) => any;
  onChangeUnit: (val: NumberRank) => any;
}

interface OscFormProps {
  value: string[];
  currentMeters: string[];
  voltageMeters: string[];
  onChange: (val: string[]) => any;
  onRemove: () => any;
}

function ConfigSection(props: PropsWithChildren<SectionProps>) {
  return (
    <section className={config.section}>
      <header className={config.sectionTitle}>{props.title}</header>
      <article className={config.sectionBody}>
        {props.children}
      </article>
    </section>
  );
}

function TimeFormItem(props: TimeFormItemProps) {
  return (
    <Row className={config.formItem} gutter={4} align='middle' justify='center'>
      <Col className={config.formItemLabel} span={6}>{props.label}</Col>
      <Col span={18}>
        <Input.Group compact style={{ width: '100%' }}>
          <InputNumber
            min={0}
            size='middle'
            style={{ width: 'calc(100% - 70px)' }}
            value={props.value}
            onChange={props.onChangeValue}
          />
          <Select
            size='middle'
            style={{ width: '70px' }}
            value={props.unit}
            onChange={props.onChangeUnit}
          >
            {props.unitList.map((item) => (
              <Select.Option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Input.Group>
      </Col>
    </Row>
  );
}

function OscForm(props: OscFormProps) {
  const onRemove = () => {
    Modal.warning({
      title: '移除示波器',
      content: '确定要移除该示波器吗？',
      onOk() {
        props.onRemove();
      },
    });
  };

  return <div className={config.oscilloscopesRow}>
    <Select
      mode='multiple'
      value={props.value}
      onChange={props.onChange}
      className={config.oscilloscopesRowSelect}
      placeholder='请选择要接入示波器的测量表'
    >
      {props.currentMeters.length > 0 && (
        <Select.OptGroup label='电流表'>
          {props.currentMeters.map((id) => (
            <Select.Option key={id} value={id}>{id.replace('_', '-')}</Select.Option>
          ))}
        </Select.OptGroup>
      )}
      {props.voltageMeters.length > 0 && (
        <Select.OptGroup label='电压表'>
          {props.voltageMeters.map((id) => (
            <Select.Option key={id} value={id}>{id.replace('_', '-')}</Select.Option>
          ))}
        </Select.OptGroup>
      )}
    </Select>
    <span className={config.oscilloscopesRowDelete} onClick={onRemove}>
      <CloseCircleOutlined />
    </span>
  </div>;
}

export function Config() {
  const [partsList] = useWatcher(parts);
  const [oscList, oscMethod] = useWatcherList<string[][]>(oscilloscopes);
  const endTime = useWatcherTime(end);
  const stepTime = useWatcherTime(step);

  /** 所有电流表 */
  const currentMeters = useMemo(() => {
    return partsList
      .filter((item) => item.kind === ElectronicKind.CurrentMeter)
      .map((item) => item.id);
  }, [partsList]);
  /** 所有电压表 */
  const voltageMeters = useMemo(() => {
    return partsList
      .filter((item) => item.kind === ElectronicKind.VoltageMeter)
      .map((item) => item.id);
  }, [partsList]);

  return <Panel title='模拟设置' subtitle='Simulation Settings'>
    <ConfigSection title='时间设置'>
      <TimeFormItem
        label='模拟时长'
        value={endTime.value}
        unit={endTime.unit}
        unitList={endTimeUnits}
        onChangeValue={endTime.setValue}
        onChangeUnit={endTime.setUnit}
      />
      <TimeFormItem
        label='步长时间'
        value={stepTime.value}
        unit={stepTime.unit}
        unitList={stepTimeUnits}
        onChangeValue={stepTime.setValue}
        onChangeUnit={stepTime.setUnit}
      />
    </ConfigSection>
    <ConfigSection title='示波器设置'>
      {oscList.map((list, i) => (
        <OscForm
          key={i}
          value={list}
          currentMeters={currentMeters}
          voltageMeters={voltageMeters}
          onChange={(val) => oscMethod.replace(i, val)}
          onRemove={() => oscMethod.remove(i)}
        />
      ))}
      <Button
        type='dashed'
        style={{ width: '100%' }}
        onClick={() => oscMethod.push([])}
      >
        添加示波器
      </Button>
    </ConfigSection>
  </Panel>;
}
