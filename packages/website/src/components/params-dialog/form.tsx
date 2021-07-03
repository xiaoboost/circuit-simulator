import React from 'react';

import { useEffect } from 'react';
import { SelectList, NumberRank, normalNumberMatcher } from '@circuit/math';
import { Form, Input, Button, Select } from 'antd';
import { UnitType } from '@circuit/electronics';
import { formStyles as styles } from './styles';

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

export interface FormData {
  label: string;
  suffix: string;
  params: {
    value: string;
    rank: NumberRank;
  }[];
}

export interface Props {
  /** 器件编号 */
  id: string;
  /** 参数列表 */
  params: Params[];
  /** 点击取消按钮 */
  onCancel(): void;
  /** 点击确定按钮 */
  onConfirm(data: FormData): void;
}

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

export function ParamForm(props: Props) {
  const [form] = Form.useForm<FormData>();
  const submit = async () => {
    form.validateFields().then((data) => {
      props.onConfirm(data);
    });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(toFormData(props));
  }, [props]);

  return <>
    <header className={styles.boxHeader}>器件参数</header>
    <article className={styles.boxBody}>
      <section className={styles.formLabelList}>
        <div className={styles.formLabelItem}>编号</div>
        {props.params.map((param) => (
          <div className={styles.formLabelItem} key={param.label}>{param.label}</div>
        ))}
      </section>
      <Form
        form={form}
        layout='horizontal'
        labelAlign='right'
        className={styles.form}
      >
        <Input.Group compact className={styles.resetInputCompact}>
          <Form.Item
            name='label'
            rules={[{
              pattern: /^[A-Z]/,
              required: true,
            }]}
          >
            <Input
              required
              size='small'
              placeholder='Label'
              className={styles.idInput}
            />
          </Form.Item>
          <Form.Item>
            <Input
              disabled
              size='small'
              placeholder="-"
              className={styles.idSplit}
            />
          </Form.Item>
          <Form.Item
            name='suffix'
            rules={[{
              pattern: /^\d+$/,
              required: true,
            }]}
          >
            <Input
              required
              size='small'
              className={styles.idSubInput}
              placeholder='Suffix'
            />
          </Form.Item>
        </Input.Group>
        {props.params.map((param, i) => (
          <Input.Group compact key={param.label}>
            {param.units.length === 0
              ? <Form.Item
                name={['params', i, 'value']}
                rules={[{
                  pattern: normalNumberMatcher,
                  required: true,
                }]}
              >
                <Input
                  size='small'
                  addonAfter={param.unit}
                />
              </Form.Item>
              : <>
                <Form.Item
                  name={['params', i, 'value']}
                  rules={[{
                    pattern: normalNumberMatcher,
                    required: true,
                  }]}
                >
                  <Input
                    size='small'
                    placeholder='Param Value'
                  />
                </Form.Item>
                <Form.Item name={['params', i, 'rank']}>
                  <Select size='small'>
                    {param.units.map((item) => (
                      <Select.Option
                        value={item.value}
                        key={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            }
          </Input.Group>
        ))}
      </Form>
    </article>
    <footer className={styles.boxFooter}>
      <Button
        danger
        type='text'
        size='small'
        onClick={props.onCancel}
      >
        取消
      </Button>
      <Button
        type='text'
        size='small'
        className={styles.confirmBtn}
        onClick={submit}
      >
        确定
      </Button>
    </footer>
    <aside className={styles.dialogTriangle} />
  </>;
}
