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
    /** 每个进程的独立标识符 */
    id = Math.random().toString(36).substring(2);

    constructor(workerConstructor: WorkerConstructor) {
        this.worker = new workerConstructor();
    }
}

export default class ProcessManager {
    /** 管理器参数 */
    options: ManagerOption;

    /** 进程池 */
    private readonly pool: WorkerProcess[] = [];
    /** 等待队列 */
    private readonly waitQueue = [];
    /** 进程构造函数 */
    private readonly workerConstructor: WorkerConstructor;

    constructor(worker: WorkerConstructor, opts?: ManagerOption) {
        this.options = {
            min: 1,
            max: 4,
            timeout: 60,
            ...(opts || {}),
        };

        this.workerConstructor = worker;
    }

    async getIdleProcess(): Promise<WorkerProcess> {
        const idle = this.pool.find((process) => !process.isBusy);
        // 有空闲进程，则返回该进程
        if (idle) {
            return Promise.resolve(idle);
        }
        // 进程池未满，则创建新的进程
        if (this.pool.length < this.options.max) {
            return Promise.resolve(new WorkerProcess(this.workerConstructor));
        }
        // 进程池已满，等待进空闲
    }
}
