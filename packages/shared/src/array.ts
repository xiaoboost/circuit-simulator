/* eslint-disable @typescript-eslint/no-unused-vars */

import { isArray, isDef } from '@xiao-ai/utils';

export abstract class ArrayLike<Data, Input extends any[], Structure = Data> extends Array<Data> {
  protected _isEqual(a1: Data, a2: Data) {
    return void 0 as any;
  }
  protected _packaged(...args: Input): Data {
    return void 0 as any;
  }
  protected _toData(a: Data): Structure {
    return a as any;
  }
  protected _findIndex(data: Data) {
    return this.findIndex((item) => this._isEqual(item, data));
  }

  private _events?: Array<() => void>;

  get value(): Data | undefined {
    return this[0];
  }

  protected emit() {
    this._events?.forEach((cb) => cb());
  }

  onChange(cb: () => void) {
    if (!this._events) {
      this._events = [];
    }

    this._events.push(cb);
    cb();
  }

  clear() {
    this.length = 0;
    this.emit();
  }

  has(...args: Input): boolean {
    return Boolean(this._findIndex(this._packaged(...args)) >= 0);
  }

  add(...args: Input): void {
    if (!this.has(...args)) {
      this.push(this._packaged(...args));
      this.emit();
    }
  }

  set(data: Data | undefined | (Data | undefined)[]): void {
    const list = (isArray(data) ? data : [data]).filter(isDef);
    this.splice(0, this.length, ...list);
    this.emit();
  }

  delete(...args: Input): boolean {
    const index = this._findIndex(this._packaged(...args));

    if (index >= 0) {
      this.splice(index, 1);
      this.emit();
      return true;
    }
    else {
      return false;
    }
  }

  toData() {
    return Array.from(this).map(this._toData);
  }
}
