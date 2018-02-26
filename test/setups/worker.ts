import http from 'http';
import https from 'https';

/** Message 事件回调 */
type MessageCallback = (event: MessageEvent) => any;
/** 作用域接口 */
interface Scope {
    onmessage: null | MessageCallback;

    terminate(): void;
    postMessage(data: any): void;
    dispatchEvent(type: 'message'): void;
    addEventListener(type: 'message', callback: MessageCallback): void;
    removeEventListener(type: 'message', callback: MessageCallback): void;
}

/** 全局变量 */
const win: Window = global as any;
// 全局缓存
const $cache: { [key: string]: Blob } = {};

if (!win.URL) {
    Object.defineProperty(win, 'URL', {
        writable: false,
        configurable: false,
        value: {},
    });
}

/**
 * 创建 uuid
 * @returns {string} uuid
 */
function createUUID() {
    const dec2hex: string[] = [];

    for (let i = 0; i <= 15; i++) {
        dec2hex[i] = i.toString(16);
    }

    let uuid = '';

    for (let i = 1; i <= 36; i++) {
        if (i === 9 || i === 14 || i === 19 || i === 24) {
            uuid += '-';
        }
        else if (i === 15) {
            uuid += 4;
        }
        else if (i === 20) {
            uuid += dec2hex[(Math.random() * 4 | 0 + 8)];
        }
        else {
            uuid += dec2hex[(Math.random() * 15 | 0)];
        }
    }
    return uuid;
}

/**
 * 获取输入链接中的代码
 * @param {string} url 请求链接
 * @returns {Promise<string>} 返回代码的字符串
 */
function fetchCode(url: string): Promise<string> {
    if (url.match(/^blob:/)) {
        return new Promise((resolve) => {
            const file = new FileReader();
            const id = url.match(/[^/]+$/)![0];
            file.readAsText($cache[id]);

            file.addEventListener('loadend', () => resolve(file.result));
        });
    }
    else if (url.match(/^http:/)) {
        return new Promise((resolve) => http.request(url, (res) => {
            let code = '';
            res.on('finish', () => resolve(code));
            res.on('data', (chunk) => code += chunk.toString());
        }));
    }
    else if (url.match(/^https:/)) {
        return new Promise((resolve) => https.request(url, (res) => {
            let code = '';
            res.on('finish', () => resolve(code));
            res.on('data', (chunk) => code += chunk.toString());
        }));
    }
    else {
        throw new Error('(worker) wrong url.');
    }
}

/** 创建 Message 事件对象 */
function createCustomMessage(data: any): MessageEvent {
    const event: MessageEvent = {
        type: 'message',
        timeStamp: new Date().getTime(),
        data: JSON.parse(JSON.stringify(data)),
    } as any;

    return event;
}

win.URL.createObjectURL = (blob: Blob) => {
    const id = createUUID();

    $cache[id] = blob;
    return `blob:http://localhost/${id}`;
};

/** 内部自定义 MessageEvent 类 */
class CustomEventTarget {
    /** 默认事件接口 */
    onmessage?: (event: MessageEvent) => any;

    /** 停止标记 */
    private _isStop = false;
    /** 事件列表 */
    private _events: MessageCallback[] = [];

    addEventListener(type: 'message', callback: MessageCallback): void {
        if (type !== 'message') {
            return;
        }

        this._events.push(callback);
    }
    removeEventListener(type: 'message', callback: MessageCallback) {
        if (type !== 'message') {
            return;
        }

        this._events = this._events.filter((func) => func !== callback);
    }
    dispatchEvent(event: MessageEvent) {
        if (this._isStop) {
            return;
        }

        if (this.onmessage) {
            this.onmessage(event);
        }

        this._events.forEach((func) => func(event));
    }

    stopImmediatePropagation() {
        this._isStop = true;
    }
}

/** 自定义 Worker 类 */
class CustomWorker extends CustomEventTarget {
    /** 代码是否获取完成 */
    private _isFetch: Promise<void>;
    /** woker 内部事件 */
    private _inside = new CustomEventTarget();
    /** 获取闭包中的 inside 属性 */
    private _insideOnmessage: {
        get(): MessageCallback;
        set(value: MessageCallback): void;
    };

    constructor(url: string) {
        super();

        this._isFetch = this._init(url);
    }

    /** 由外向内地触发事件 */
    async postMessage(data: any) {
        await this._isFetch;
        await (new Promise((r) => setTimeout(r, 0)));

        this._inside.onmessage = this._insideOnmessage.get();
        this._inside.dispatchEvent(createCustomMessage(data));
    }
    terminate() {
        this.stopImmediatePropagation();
        this._inside.stopImmediatePropagation();
    }

    /** 初始化 */
    private async _init(url: string) {
        // worker 代码
        const code = await fetchCode(url);
        // 生成 worker 作用域中的全局变量
        const scope: Scope = {
            onmessage: null,

            // 由内向外触发事件
            postMessage: (e: any) => {
                setTimeout(() => {
                    this.dispatchEvent(createCustomMessage(e));
                });
            },

            terminate: this.stopImmediatePropagation.bind(this._inside),
            dispatchEvent: this.dispatchEvent.bind(this._inside),
            addEventListener: this.addEventListener.bind(this._inside),
            removeEventListener: this.removeEventListener.bind(this._inside),
        };

        Object.defineProperty(scope, 'log', {
            value(str: string) {
                console.log(str);
            },
        });

        Object.defineProperty(scope, 'onmessage', {
            configurable: false,
            enumerable: true,

            get: () => {
                return this._inside.onmessage || null;
            },
            set: (value) => {
                this._inside.onmessage = value;
                this._insideOnmessage.set(value);
            },
        });

        // 作用域内变量声明语句
        let statement = 'let self = this\n';
        Object.keys(scope).forEach((key) => statement += `, ${key} = self.${key}`);
        statement += ';\n';

        /* tslint:disable-next-line:no-eval  */
        const func = eval(`
            (function() {
                ${statement}

                setTimeout(() => {
                    ${code}
                });

                return {
                    get() {
                        return onmessage;
                    },
                    set(value) {
                        onmessage = value;
                    },
                };
            })`) as () => void;

        // worker 首次运行
        this._insideOnmessage = func.call(scope, scope);
    }
}

if (!win.hasOwnProperty('Worker')) {
    Object.defineProperty(win, 'Worker', {
        writable: false,
        configurable: false,
        value: CustomWorker,
    });
}
