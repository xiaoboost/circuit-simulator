import React from 'react';

import { config } from './styles';
import { Panel } from './components/panel';
import { parts, ElectronicKind } from 'src/components/electronics';
import { shortUnitList, NumberRank, SelectList } from '@circuit/math';
import { InputNumber, Select, Input, Button, Row, Col } from 'antd';

import { Watcher } from '@xiao-ai/utils';
import { useWatcher } from '@xiao-ai/utils/use';

import { PropsWithChildren, useState } from 'react';

/** 结束时间单位选择 */
const endTimeUnits = shortUnitList(['', 'm', 'u'], '秒', true);
/** 步长时间单位选择 */
const stepTimeUnits = shortUnitList(['m', 'u', 'n', 'p'], '秒', true);
/** 结束时间 */
export const endTime = new Watcher('');
/** 步长时间 */
export const stepTime = new Watcher('');
/** 示波器参数 */
export const oscilloscopes = new Watcher<string[][]>([]);

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

interface OscilloscopeFormProps {
  index: number;
  data: string[];
  onChange: (val: string[]) => any;
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
      <Col className={config.formItemContent} span={18}>
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

function OscilloscopeForm(props: OscilloscopeFormProps) {
  return '';
}

export function Config() {
  const [partsList] = useWatcher(parts);
  const [endTime, setEndTime] = useState(0);
  const [endTimeUnit, setEndTimeUnit] = useState<NumberRank>('');
  const [stepTime, setStepTime] = useState(0);
  const [stepTimeUnit, setStepTimeUnit] = useState<NumberRank>('m');
  const [oscillData, setOscillData] = useWatcher(oscilloscopes);

  /** 所有电流表 */
  const currentMeters = partsList.filter((item) => item.kind === ElectronicKind.CurrentMeter);
  /** 所有电压表 */
  const voltageMeters = partsList.filter((item) => item.kind === ElectronicKind.VoltageMeter);

  return <Panel title='模拟设置' subtitle='Simulation Settings'>
    <ConfigSection title='时间设置'>
      <TimeFormItem
        label='模拟时长'
        value={endTime}
        unit={endTimeUnit}
        unitList={endTimeUnits}
        onChangeValue={setEndTime}
        onChangeUnit={setEndTimeUnit}
      />
      <TimeFormItem
        label='步长时间'
        value={stepTime}
        unit={stepTimeUnit}
        unitList={stepTimeUnits}
        onChangeValue={setStepTime}
        onChangeUnit={setStepTimeUnit}
      />
    </ConfigSection>
    <ConfigSection title='示波器设置'>
      form
    </ConfigSection>
  </Panel>;
}
