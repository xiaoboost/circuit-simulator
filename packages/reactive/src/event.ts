import { Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** 事件流 */
export class EventStream<T = void> {
  private readonly _subject = new Subject<T | undefined>();
  private readonly _destroy$ = new Subject<void>();
  private readonly _subscriptions = new Subscription();

  /** 触发事件 */
  emit(value?: T): void {
    this._subject.next(value);
  }

  /** 订阅事件 */
  subscribe(callback: (value?: T) => void): () => void {
    const subscription = this._subject.pipe(
      takeUntil(this._destroy$),
    ).subscribe(callback);

    this._subscriptions.add(subscription);

    return () => {
      subscription.unsubscribe();
      this._subscriptions.remove(subscription);
    };
  }

  /** 转换为可观测对象 */
  asObservable(): Observable<T> {
    return this._subject.pipe(takeUntil(this._destroy$)) as Observable<any>;
  }

  /** 销毁事件流 */
  destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._subscriptions.unsubscribe();
    this._subject.complete();
  }

  /** 一次性订阅 */
  once(callback: (value?: T) => void): () => void {
    const unsubscribe = this.subscribe((val) => {
      callback(val);
      unsubscribe();
    });

    return unsubscribe;
  }

  /** 过滤事件 */
  filter(predicate: (value?: T) => boolean): EventStream<T> {
    const filteredStream = new EventStream<T>();

    const sub = this._subject.pipe(
      takeUntil(this._destroy$),
    ).subscribe(value => {
      if (predicate(value)) {
        filteredStream.emit(value);
      }
    });

    this._subscriptions.add(sub);
    return filteredStream;
  }

  /** 映射事件 */
  map<R>(mapper: (value?: T) => R): EventStream<R> {
    const mappedStream = new EventStream<R>();

    const sub = this._subject.pipe(
      takeUntil(this._destroy$),
    ).subscribe(value => {
      mappedStream.emit(mapper(value));
    });

    this._subscriptions.add(sub);
    return mappedStream;
  }
}
