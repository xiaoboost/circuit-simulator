import React from 'react';
import * as Styles from './styles.less';

export interface FormProps {
  title: string;
  children: React.ReactNode;
}

export function Form({ title, children }: FormProps) {
  return (
    <section className={Styles.form}>
      <header className={Styles.formTitle}>{title}</header>
      <div className={Styles.formContent}>{children}</div>
    </section>
  );
}
