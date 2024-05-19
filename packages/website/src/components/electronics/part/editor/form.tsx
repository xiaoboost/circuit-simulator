import React from 'react';

import { useEffect } from 'react';
import { SelectList, NumberRank, normalNumberMatcher } from '@circuit/math';
import { Form, Input, Button, Select } from 'antd';
import { UnitType } from '@circuit/electronics';
import { formStyles as styles } from './styles';

export interface Param {
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

export interface PartParamEditorForm {
  /** 器件编号 */
  id: string;
  /** 参数列表 */
  params: Param[];
  /** 点击取消按钮 */
  onCancel(): void;
  /** 点击确定按钮 */
  onConfirm(data: FormData): void;
}

function toFormData(props: PartParamEditorForm): FormData {
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

export function PartParamEditorForm(props: PartParamEditorForm) {
  const [form] = Form.useForm<FormData>();
  const unitLabelLen = props.params.map((param) => {
    const maxLen = Math.max(
      ...param.units
        .map((item) => `${item.value}${item.label}`.length)
    );
    return maxLen * 13 + 34;
  });
  const maxLabelLen = Math.max(
    ...['编号']
      .concat(props.params.map((item) => item.label))
      .map((item) => item.length)
  );
  const labelWidth = 15 * maxLabelLen + 16;
  const formWith = labelWidth + 160;
  const submit = async () => {
    form.validateFields().then((data) => {
      props.onConfirm(data);
    });
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(toFormData(props));
  }, [props]);

  return (
    <div className={styles.editorForm}>
      <header className={styles.boxHeader}>编辑器件参数</header>
      <article className={styles.boxBody}>
        <Form
          form={form}
          layout='horizontal'
          className={styles.form}
          style={{ width: formWith }}
          labelAlign='right'
          labelCol={{
            span: Math.floor(labelWidth / formWith * 24),
            // xs: { span: 24 },
            // sm: { span: 6 },
          }}
        >
          {/* 编号 */}
          <Form.Item label='编号' labelAlign='right'>
            <Input.Group compact className={styles.resetInputCompact}>
              <Form.Item
                name='label'
                rules={[{
                  pattern: /^[A-Za-z\d]+$/,
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
                  pattern: /^[A-Za-z\d]+$/,
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
          </Form.Item>
          {/* 参数列表 */}
          {props.params.map((param, i) => (
            <Form.Item label={param.label}>
              <Input.Group compact key={param.label} size='small'>
                <Form.Item
                  name={['params', i, 'value']}
                  rules={[{
                    pattern: normalNumberMatcher,
                    required: true,
                  }]}
                >
                  <Input
                    size='small'
                    className={styles.formParamUnit}
                    addonAfter={param.units.length === 0
                      ? param.unit
                      : (
                        <Form.Item noStyle name={['params', i, 'rank']}>
                          <Select
                            size='small'
                            style={{ width: unitLabelLen[i] }}
                          >
                            {param.units.map((item) => (
                              <Select.Option
                                value={item.value}
                                key={item.value}
                              >
                                {item.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )
                    }
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
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
    </div>
  );
}
