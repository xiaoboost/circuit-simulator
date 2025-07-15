import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, pairwise, map, startWith } from 'rxjs/operators';

type ObserveCallback<T> = (current: T, previous?: T) => void;

/** 只读状态监听器 */
export class ReadonlyWatcher<T> {
  /** 内部状态订阅器 */
  private readonly _subject: BehaviorSubject<T>;
  /** 销毁信号 */
  private readonly _destroy$ = new Subject<void>();

  constructor(initialValue: T) {
    this._subject = new BehaviorSubject<T>(initialValue);
  }

  /** 当前值 */
  get data(): T {
    return this._subject.value;
  }

  /** 内部更新方法 */
  protected _setData(value: T): void {
    // 值不同时才更新
    if (!Object.is(value, this.data)) {
      this._subject.next(value);
    }
  }

  /** 监听值变化 */
  observe(callback: ObserveCallback<T>): () => void {
    const subscription = this._subject.pipe(
      // 初始化上次值
      startWith(undefined as T | undefined),
      // 生成 [previous, current] 元组
      pairwise(),
      // 交换元组顺序
      map(([previous, current]) => [current, previous] as [T, T | undefined]),
      takeUntil(this._destroy$),
    ).subscribe(([current, previous]) => callback(current, previous));

    return () => subscription.unsubscribe();
  }

  /** 单次监听 */
  once(callback: ObserveCallback<T>): () => void {
    const unsubscribe = this.observe((current, previous) => {
      callback(current, previous);
      unsubscribe();
    });

    return unsubscribe;
  }

  /** 创建计算属性 */
  computed<R>(computeFn: (value: T) => R): ReadonlyWatcher<R> {
    const computedWatcher = new ReadonlyWatcher(computeFn(this.data));

    this.observe(current => {
      computedWatcher['_setData'](computeFn(current));
    });

    return computedWatcher;
  }

  /** 转换为标准 Observable */
  asObservable(): Observable<T> {
    return this._subject.pipe(
      distinctUntilChanged(),
      takeUntil(this._destroy$),
    );
  }

  /** 销毁监听器 */
  destroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._subject.complete();
  }
}

/** 状态监听器 */
export class Watcher<T> extends ReadonlyWatcher<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }

  /** 设置新值 */
  setData(value: T): void {
    this._setData(value);
  }
}
