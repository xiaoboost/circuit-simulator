import React from 'react';

import { useEffect, useState } from 'react';
import { Point, SelectList, NumberRank } from 'src/math';
import { UnitType } from '../electronics';
import { styles } from './styles';
import { Form, Input, Button } from 'antd';

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

export interface FormValue {
  label: string;
  suffix: string;
}

export function ParamsDialog(props: Props) {
  const [visible, setVisible] = useState(false);
  const [label, suffix] = props.id.split('_');
  const [form] = Form.useForm<FormValue>();
  const classNames = styles({
    visible
  });
  const onCancel = () => {
    setVisible(false);
    props.onCancel?.();
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  return <div className={classNames.boxWrapper}>
    <div
      className={classNames.box}
      style={{
        left: props.position[0],
        top: props.position[1],
      }}
    >
      <header className={classNames.boxHeader}>器件参数</header>
      <article className={classNames.boxBody}>
        <Form
          form={form}
          layout='horizontal'
          labelAlign='right'
        >
          <Form.Item label='编号'>
            <Input.Group compact>
              <Input
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
                size='small'
                value={suffix}
                className={classNames.idSubInput}
                placeholder='Suffix'
              />
            </Input.Group>
          </Form.Item>
          <Form.Item label='编号编号'></Form.Item>
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
        <Button type='text' size='small'>确定</Button>
      </footer>
    </div>
  </div>;
}
