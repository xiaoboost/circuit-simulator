import { $P } from 'src/lib/point';

function mouseEvent($event) {
    const code = { left: 0, right: 2 };
    return () => new Promise((resolve) => {
        $event.el.addEventListener($event.type, function stop(event) {
            if (event.button === code[$event.which]) {
                $event.el.removeEventListener($event.name, stop);
                resolve();
            }
        }, true);
    });
}

function toCursor(cursor) {
    return (!cursor || cursor === 'default')
        ? 'default'
        : `url(/cur/${cursor}.cur), crosshair`;
}

/**
 * 事件回调队列类
 * @class Handlers
 */
class Handlers {
    constructor(component, args) {
        this.component = component;
        this.handlers = args.map((obj) => {
            if (obj instanceof Function) {
                return {
                    capture: false,
                    type: 'mousemove',
                    callback: component.toHandler(obj, 'mousemove'),
                };
            } else {
                obj.capture = !!obj.capture;
                obj.callback = component.toHandler(obj.callback, obj.type);
                return obj;
            }
        });
    }
    bind() {
        const component = this.component;
        this.handlers.forEach((obj) => {
            if (obj.delegate) {
                component.$$on(obj.type, obj.select, obj.callback);
            } else {
                component.$el.addEventListener(obj.type, obj.callback, obj.capture);
            }
        });
    }
    unbind() {
        const component = this.component;
        this.handlers.forEach((obj) => {
            if (obj.delegate) {
                component.$$off(obj.type, obj.select, obj.callback);
            } else {
                component.$el.removeEventListener(obj.type, obj.callback, obj.capture);
            }
        });
    }
}

export default {
    data() {
        return {
            exclusion: false,
        };
    },
    methods: {
        /**
         * 对事件回调函数进行封装
         * 在运行回调之前插入一段矫正鼠标坐标的操作，并将结果传入实际的回调中
         * @param {function} fn
         * @returns {function} callback
         */
        toHandler(fn, type) {
            let last = false;
            const callbackOutter = (e) => {
                const origin = $P(e.pageX, e.pageY),
                    mouse = origin.add(-1, this.position).mul(1 / this.zoom),
                    bias = last
                        ? origin.add(-1, last).mul(1 / this.zoom)
                        : $P(0, 0);

                last = origin;
                e.$mouse = mouse;
                e.$bias = bias;
                fn(e);
            };

            // TODO: 生产环境时，mousemove 事件不需要异步调用
            return (type !== 'mousemove')
                ? callbackOutter
                /**
                 *     chrome 浏览器（v59 ~ *）的 mousemove 事件有 bug，表现为 debug 时浏览器的 UI 进程被阻
                 * 塞了，无法进行实时的 UI 更新。目测是因为有某个进程阻塞的 UI 进程，所以这里用异步来运行回调，
                 * 等那某个进程运行完毕就行了。但是又因为回调是异步的，所以经常会造成 afterEvent 运行之后又
                 * 运行了一次回调的情况发生，所以这里必须再进行一次判断，以确保事件被取消之后回调不会被运行。
                 */
                : (e) => setTimeout(() => this.exclusion && callbackOutter(e));
        },
        EventControler({ exclusion = true, cursor, handlers, beforeEvent, stopEvent, afterEvent }) {
            // 如果有互斥事件在运行，且当前事件也是互斥的，那么忽略当前事件
            if (this.exclusion && exclusion) {
                return (false);
            } else {
                this.exclusion = !!exclusion;
            }

            // 设定鼠标指针
            const cursorResult = (cursor.call)
                ? (e) => (this.$el.style.cursor = toCursor(cursor(e)))
                : toCursor(cursor);
            // 回调事件队列
            handlers = (handlers instanceof Array) ? handlers : [handlers];
            (cursorResult.call) && handlers.push(cursorResult);
            handlers = new Handlers(this, handlers);

            // 起始事件
            beforeEvent = new Promise(beforeEvent || ((res) => res()));
            // 生成终止事件
            if (!(this.stopEvent instanceof Function)) {
                stopEvent = mouseEvent(stopEvent);
            }

            // 事件回调生命周期
            beforeEvent
                // 绑定事件本身和结束条件
                .then(() => {
                    handlers.bind();
                    (!cursorResult.call) && (this.$el.style.cursor = cursorResult);
                    return stopEvent();
                })
                // 事件结束，解除事件绑定
                .then(() => {
                    handlers.unbind();
                    this.exclusion = false;
                    afterEvent && afterEvent();
                    this.$el.style.cursor = 'default';
                });
        },
    },
};
