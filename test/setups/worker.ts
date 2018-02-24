import mitt from 'mitt';
import fetch, { Response } from 'node-fetch';

// 全局变量
const self: Window = global as any;

if (!self.URL) {
    Object.defineProperty(self, 'URL', {});
}

if (!self.document) {
    Object.defineProperty(self, 'document', document);
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

// 全局缓存
const $cache: { [key: string]: Blob } = {};

self.URL.createObjectURL = (blob: Blob) => {
    const id = createUUID();

    $cache[id] = blob;
    return `blob:http://localhost/${id}`;
};

const oldFetch = self.fetch || fetch;

self.fetch = function(url: string, opts: RequestInit) {
    if (url.match(/^blob:/)) {
        return new Promise((resolve, reject) => {
            const file = new FileReader();

            file.onload = () => {
                resolve(new Response(file.result, { status: 200, statusText: 'OK' }));
            };
            file.onerror = () => {
                reject(file.error);
            };

            const id = url.match(/[^/]+$/)![0];
            file.readAsText($cache[id]);
        });
    }
    else {
        return oldFetch.call(this, url, opts);
    }
};

function Event(type: string) {
    this.type = type;
}
Event.prototype.initEvent = Object;

if (!self.document.createEvent) {
    self.document.createEvent = function(type) {
        let Ctor = global[type] || Event;
        return new Ctor(type);
    };
}

self.Worker = function Worker(url) {
    let messageQueue = [],
        inside = mitt(),
        outside = mitt(),
        scope = {
            onmessage: null,
            dispatchEvent: inside.emit,
            addEventListener: inside.on,
            removeEventListener: inside.off,
            postMessage(data) {
                outside.emit('message', { data });
            },
            fetch: self.fetch,
            importScripts(...urls) {}
        },
        getScopeVar;

    inside.on('message', (e) => {
        let f = getScopeVar('onmessage');

        if (f) {
            f.call(scope, e);
        }
    });

    this.addEventListener = outside.on;
    this.removeEventListener = outside.off;
    this.dispatchEvent = outside.emit;

    outside.on('message', (e) => {
        this.onmessage && this.onmessage(e);
    });

    this.postMessage = (data) => {
        if (messageQueue!=null) messageQueue.push(data);
        else inside.emit('message', { data });
    };

    this.terminate = () => {
        throw Error('Not Supported');
    };

    self.fetch(url)
        .then((r) => r.text())
        .then((code) => {
            let vars = 'var self = this, global = self';

            for (const k in scope) {
                vars += `, ${k} = self.${k}`;
            }

            getScopeVar = eval('(function() {'+vars+'\n'+code+'\nreturn function(__){return eval(__)}})').call(scope);

            let q = messageQueue;
            messageQueue = null;
            q.forEach(this.postMessage);
        })
        .catch((e) => { outside.emit('error', e); console.error(e); });
};
