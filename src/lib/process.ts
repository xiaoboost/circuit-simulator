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
    worker: Worker;
    /** 当前进程所在管理器 */
    manager: ProcessManager;
    /** 每个进程的独立标识符 */
    id = Math.random().toString(36).substring(2);
    /** 进程释放事件 */
    freeEvent: () => void;

    /** 静默定时器 ID */
    private timer: number;
    /** 是否繁忙标志 */
    private busy = false;

    constructor(manager: ProcessManager, workerCreator: workerCreator) {
        this.manager = manager;
        this.freeEvent = () => void 0;
        this.worker = workerCreator();
    }

    get isBusy() {
        return this.busy;
    }
    set isBusy(value: boolean) {
        if (value === this.busy) {
            return;
        }

        this.busy = value;

        // 繁忙标志位置高，清除自销毁定时器
        if (value) {
            window.clearTimeout(this.timer);
            this.timer = -1;
        }
        // 繁忙标志位置低，设定自销毁定时器
        else {
            this.timer = window.setTimeout(
                () => this.destroy(),
                this.manager.options.timeout * 1000,
            );

            window.setTimeout(() => {
                this.freeEvent();
                this.freeEvent = () => void 0;
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
    /** 销毁当前子进程 */
    destroy() {
        this.worker.terminate();
        this.manager.deleteProcess(this.id);
    }
}

/** 进程管理器 */
export default class ProcessManager {
    /** 管理器参数 */
    options: ManagerOption;

    /** 等待进程 */
    private waitQueue: Promise<WorkerProcess>;
    /** 进程池 */
    private readonly pool: WorkerProcess[] = [];
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
                                process.freeEvent = function freeEvent() {
                                    debugger;
                                    resolve(this);
                                },
                        ),
                ),
            );

            debugger;
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
