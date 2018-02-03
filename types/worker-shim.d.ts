/** worker 类封装 */
interface WebpackWorker extends Worker {}

declare const WebpackWorker: {
    prototype: WebpackWorker;
    new(): WebpackWorker;
};

declare type WorkerConstructor = {
    prototype: Worker;
    new(): Worker;
}

declare module 'worker-loader!*' {
    export default WebpackWorker;
}

declare namespace workerApi {
    /** 标准数据返回格式 */
    export interface Response<T> {
        /** 当前返回状态码 */
        code: string;
        /** 数据集 */
        result: T;
    }
}
