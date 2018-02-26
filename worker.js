import http from 'http';
import https from 'https';
/** 全局变量 */
const win = global;
// 全局缓存
const $cache = {};
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
    const dec2hex = [];
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
function fetchCode(url) {
    if (url.match(/^blob:/)) {
        return new Promise((resolve) => {
            const file = new FileReader();
            const id = url.match(/[^/]+$/)[0];
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
function createCustomMessage(data) {
    const event = {
        type: 'message',
        timeStamp: new Date().getTime(),
        data: JSON.parse(JSON.stringify(data)),
    };
    return event;
}
win.URL.createObjectURL = (blob) => {
    const id = createUUID();
    $cache[id] = blob;
    return `blob:http://localhost/${id}`;
};
/** 内部自定义 MessageEvent 类 */
class CustomEventTarget {
    constructor() {
        /** 停止标记 */
        this._isStop = false;
        /** 事件列表 */
        this._events = [];
    }
    addEventListener(type, callback) {
        if (type !== 'message') {
            return;
        }
        this._events.push(callback);
    }
    removeEventListener(type, callback) {
        if (type !== 'message') {
            return;
        }
        this._events = this._events.filter((func) => func !== callback);
    }
    dispatchEvent(event) {
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
    constructor(url) {
        super();
        /** woker 内部事件 */
        this._inside = new CustomEventTarget();
        this._init(url);
    }
    /** 由外向内地触发事件 */
    postMessage(data) {
        setTimeout(() => {
            this._inside.onmessage = this._insideOnmessage.get();
            this._inside.dispatchEvent(createCustomMessage(data));
        });
    }
    terminate() {
        this.stopImmediatePropagation();
        this._inside.stopImmediatePropagation();
    }
    /** 初始化 */
    async _init(url) {
        // worker 代码
        const code = await fetchCode(url);
        // 生成 worker 作用域中的全局变量
        const scope = {
            onmessage: null,
            // 由内向外触发事件
            postMessage: (e) => {
                console.log('outter');
                setTimeout(() => {
                    console.log('outter');
                    this.dispatchEvent(createCustomMessage(e));
                });
            },
            terminate: this.stopImmediatePropagation.bind(this._inside),
            dispatchEvent: this.dispatchEvent.bind(this._inside),
            addEventListener: this.addEventListener.bind(this._inside),
            removeEventListener: this.removeEventListener.bind(this._inside),
        };
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
        let statement = 'let self = this;\n';
        Object.keys(scope).forEach((key) => statement += `, ${key} = self.${key}`);
        statement += ';\n';
        /* tslint:disable-next-line:no-eval  */
        const func = eval(`
            (function() {
                ${statement}
                ${code}

                return {
                    get() {
                        debugger;
                        return onmessage;
                    },
                    set(value) {
                        debugger;
                        onmessage = value;
                    },
                };
            })`);
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
