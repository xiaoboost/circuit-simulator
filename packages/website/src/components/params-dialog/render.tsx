import React from 'react';

import { useEffect, useState, useRef } from 'react';
import { Point, SelectList, NumberRank } from '@circuit/math';
import { Form, Input, Button, Select } from 'antd';
import { delay } from '@xiao-ai/utils';
import { UnitType } from '../electronics';
import { styles, StyleProps, transformTime } from './styles';

export interface Params {
  /** 该参数的文字说明 */
  label: string;
  /** 该参数的可选单位 */
  units: SelectList;
  /** 该参数的单位 */
  unit: UnitType;
  /** 该参数的值 */
  value: string;
  /** 该参数所选的单位 */
  rank: NumberRank;
}

export interface Props {
  /** 器件编号 */
  id: string;
  /** 参数列表 */
  params: Params[];
  /** 指向的中心位置 */
  position: Point;
  /** 是否显示 */
  visible: boolean;
  /** 点击取消按钮 */
  onCancel?(): void;
  /** 点击确定按钮 */
  onConfirm?(): void;
}

export interface FormData {
  label: string;
  suffix: string;
  params: {
    value: string;
    rank: NumberRank;
  }[];
}

type ValidateStatus = "" | "error";

function toFormData(props: Props): FormData {
  const [label, suffix] = props.id.split('_');
  return {
    label,
    suffix,
    params: props.params.map((item) => ({
      value: item.value,
      rank: item.rank,
    })),
  };
}

export function ParamsDialog(props: Props) {
  const dialogEl = useRef<HTMLDivElement>(null);
  const [label, suffix] = props.id.split('_');
  const [formStatus, setFormStatus] = useState<ValidateStatus[]>([]);
  const [formData, setFormData] = useState<FormData>({
    label: '',
    suffix: '',
    params: [],
  });
  const [styleStatus, setStyleStatus] = useState<StyleProps>({
    isStart: false,
    isPending: true,
    left: 1e6,
    top: 1e6,
    height: 0,
    width: 0,
  });
  const classNames = styles(styleStatus);
  const onCancel = () => props.onCancel?.();
  
  useEffect(() => {
    setFormData(toFormData(props));
    setFormStatus(Array(props.params.length + 1).fill(''));
  }, [props]);

  useEffect(() => {
    (async () => {
      if (props.visible) {
        setStyleStatus({
          isStart: true,
          isPending: false,
          left: props.position[0],
          top: props.position[1],
          height: 0,
          width: 0,
        });

        await delay();

        const rect = dialogEl.current!.getBoundingClientRect();

        debugger;
        setStyleStatus({
          isStart: true,
          isPending: false,
          height: rect.height,
          width: rect.width,
          left: props.position[0],
          top: props.position[1],
        });

        await delay(transformTime);

        setStyleStatus({
          isStart: false,
          isPending: false,
          height: rect.height,
          width: rect.width,
          left: props.position[0],
          top: props.position[1],
        });
        
        await delay();

        setStyleStatus({
          isStart: false,
          isPending: true,
          height: rect.height,
          width: rect.width,
          left: props.position[0],
          top: props.position[1],
        });
      }
      else {
        setStyleStatus({
          ...styleStatus,
          isStart: false,
        });
      }
    })();
  }, [props.visible]);

  return <div className={classNames.boxWrapper}>
    <div
      ref={dialogEl}
      className={classNames.box}
    >
      <header className={classNames.boxHeader}>器件参数</header>
      <article className={classNames.boxBody}>
        <section className={classNames.formLabelList}>
          <div className={classNames.formLabelItem}>编号</div>
          {props.params.map((param) => (
            <div className={classNames.formLabelItem} key={param.label}>{param.label}</div>
          ))}
        </section>
        <Form
          layout='horizontal'
          labelAlign='right'
          className={classNames.form}
        >
          <Form.Item validateStatus={formStatus[0]}>
            <Input.Group compact>
              <Input
                required
                size='small'
                value={label}
                placeholder='Label'
                className={classNames.idInput}
              />
              <Input
                size='small'
                disabled
                className={classNames.idSplit}
                placeholder="-"
              />
              <Input
                required
                size='small'
                value={suffix}
                className={classNames.idSubInput}
                placeholder='Suffix'
              />
            </Input.Group>
          </Form.Item>
          {props.params.map((param, i) => (
            <Form.Item key={param.label} validateStatus={formStatus[i + 1]}>
              {param.units.length > 0
                ? <Input.Group compact>
                  <Input
                    size='small'
                    value={param.value}
                    placeholder='Param Value'
                  />
                  <Select value={param.rank} size='small'>
                    {param.units.map((item) => (
                      <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
                    ))}
                  </Select>
                </Input.Group>
                : <Input
                  size='small'
                  value={param.value}
                  addonAfter={param.unit}
                />
              }
            </Form.Item>
          ))}
        </Form>
      </article>
      <footer className={classNames.boxFooter}>
        <Button
          danger
          type='text'
          size='small'
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          type='text'
          size='small'
          className={classNames.confirmBtn}
        >
          确定
        </Button>
      </footer>
      <aside className={classNames.dialogTriangle} />
    </div>
  </div>;
}