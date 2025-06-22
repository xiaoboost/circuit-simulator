import React from 'react';
import * as Styles from './styles.less';

export interface FormItemProps {
  title: string;
  error?: string;
  children: React.ReactNode;
}

export function FormItem({ title, error, children }: FormItemProps) {
  return (
    <div className={Styles.formItem}>
      <div className={Styles.formItemContent}>
        <div className={Styles.formItemName}>{title}</div>
        <div className={Styles.formItemValue}>{children}</div>
        {error && <div className={Styles.formItemError}>{error}</div>}
      </div>
    </div>
  );
}
