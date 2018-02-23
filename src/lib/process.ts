import { onceEvent } from 'src/lib/utils';

/** 进程管理器设置接口 */
interface ManagerOption {
    /** 进程数量下限 */
    min: number;
    /** 进程数量上限 */
    max: number;
    /** 空闲进程存在的时间 */
    timeout: number;
}

/** 进程类 */
class WorkerProcess {
    /** 进程原始数据 */
    readonly worker: Worker;
    /** 当前进程所在管理器 */
    readonly manager: ProcessManager;
    /** 每个进程的独立标识符 */
    readonly id = Math.random().toString(36).substring(2);

    /** 自毁定时器 ID */
    private _timer = -1;
    /** 是否繁忙标志 */
    private _busy = false;
    /** 进程释放事件队列 */
    private readonly _freeEvents: Array<(process: WorkerProcess) => void> = [];

    constructor(manager: ProcessManager, workerCreator: workerCreator) {
        this.manager = manager;
        this.worker = workerCreator();
    }

    get isBusy() {
        return this._busy;
    }
    set isBusy(value: boolean) {
        if (value === this._busy) {
            return;
        }

        this._busy = value;

        // 繁忙标志位置高，清除自毁定时器
        if (value) {
            if (this._timer === -1) {
                return;
            }

            window.clearTimeout(this._timer);
            this._timer = -1;
        }
        // 繁忙标志位置低，设定自毁定时器
        else {
            const limit = this.manager.options.min;
            const count = this.manager.pool.length;

            // 进程数量少于最小数量，不用销毁
            if (count <= limit) {
                return;
            }

            this._timer = window.setTimeout(
                () => this.destroy(),
                this.manager.options.timeout * 1000,
            );

            window.setTimeout(() => {
                const event = this._freeEvents.pop();
                event && event(this);
            });
        }
    }

    /** 对子进程发起请求 */
    async post<T>(...args: any[]): Promise<T> {
        this.worker.postMessage(args);

        const data = await onceEvent(this.worker, 'message');
        const response = data.data as workerApi.Response<T>;

        return response.result;
    }
    /** 绑定空闲事件 */
    onFree(callback: (process: WorkerProcess) => void) {
        this._freeEvents.push(callback);
    }
    /** 销毁当前子进程 */
    destroy() {
        // this.worker.terminate();
        this.manager.deleteProcess(this.id);
    }
}

/** 进程管理器 */
export default class ProcessManager {
    /** 管理器参数 */
    options: ManagerOption;

    /** 进程池 */
    readonly pool: WorkerProcess[] = [];

    /** 等待进程 */
    private waitQueue: Promise<WorkerProcess>;
    /** 进程构造函数 */
    private readonly workerCreator: workerCreator;

    constructor(worker: workerCreator, opts?: Partial<ManagerOption>) {
        this.options = {
            min: 4,
            max: 8,
            timeout: 60,  // 秒
            ...(opts || {}),
        };

        this.workerCreator = worker;
        this.pool = Array(this.options.min).fill(0).map(() => new WorkerProcess(this, this.workerCreator));
    }

    getIdleProcess(): Promise<WorkerProcess> {
        const idle = this.pool.find((process) => !process.isBusy);
        // 有空闲进程，则返回该进程
        if (idle) {
            idle.isBusy = true;
            return Promise.resolve(idle);
        }

        // 进程池未满，则创建新的进程
        if (this.pool.length < this.options.max) {
            const worker = new WorkerProcess(this, this.workerCreator);

            worker.isBusy = true;
            this.pool.push(worker);
            return Promise.resolve(worker);
        }

        // 进程池已满
        // 等待进程空闲
        const wait = async () => {
            const result = await Promise.race<WorkerProcess>(
                this.pool.map(
                    (process) =>
                        new Promise(
                            (resolve) =>
                                process.onFree(resolve),
                        ),
                ),
            );

            result.isBusy = true;
            return result;
        };

        // 等待子进程空闲
        return this.waitQueue = (
            this.waitQueue
                ? this.waitQueue.then(wait)
                : wait()
        );
    }

    deleteProcess(id: string) {
        this.pool.delete((process) => process.id === id);
    }
}
