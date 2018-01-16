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
    /** 静默定时器 ID */
    timer: number;
    /** 是否繁忙 */
    isBusy = false;
    /** 进程原始数据 */
    worker: Worker;
    /** 当前进程所在管理器 */
    manager: ProcessManager;
    /** 每个进程的独立标识符 */
    id = Math.random().toString(36).substring(2);

    constructor(manager: ProcessManager, workerConstructor: WorkerConstructor) {
        this.manager = manager;
        this.worker = new workerConstructor();
    }

    /** 对子进程发起请求 */
    async post<T>(...args: any[]): Promise<T> {
        this.isBusy = true;
        this.worker.postMessage(JSON.stringify(args));

        const result = await onceEvent(this.worker, 'message');

        this.isBusy = false;
        return result.data;
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
    private readonly workerConstructor: WorkerConstructor;

    constructor(worker: WorkerConstructor, opts?: ManagerOption) {
        this.options = {
            min: 2,
            max: 4,
            // TODO: 自动销毁
            timeout: 60,
            ...(opts || {}),
        };

        this.workerConstructor = worker;
        this.pool = Array(this.options.min).fill(0).map(() => new WorkerProcess(this, this.workerConstructor));
    }

    async getIdleProcess(): Promise<WorkerProcess> {
        const idle = this.pool.find((process) => !process.isBusy);
        // 有空闲进程，则返回该进程
        if (idle) {
            return Promise.resolve(idle);
        }

        // 进程池未满，则创建新的进程
        if (this.pool.length < this.options.max) {
            const worker = new WorkerProcess(this, this.workerConstructor);

            this.pool.push(worker);
            return Promise.resolve(worker);
        }

        // 进程池已满
        // 给所有进程挂上一次性的钩子
        const wait = async () => {
            const event = await Promise.race(
                this.pool.map(
                    (process) =>
                        onceEvent(process.worker, 'message'),
                ),
            );

            debugger;

            return this.pool.find(
                (process) =>
                    process.worker === event.target,
            )!;
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
