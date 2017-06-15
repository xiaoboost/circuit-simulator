import { $P } from '@/libraries/point';

let _self;

function mouseEvent($event) {
    const code = { left: 0, right: 2 };
    return () => new Promise((resolve) => {
        $event.el.addEventListener($event.name, function stop(event) {
            if (event.button === code[$event.which]) {
                $event.el.removeEventListener($event.name, stop);
                resolve();
            }
        });
    });
}

// 事件回调队列类
class Handler {
    constructor(args, packaging) {
        const queue = (args instanceof Array)
            ? args : [args];

        this.handlers = queue.map((obj) => {
            if (obj instanceof Function) {
                return {
                    type: 'mousemove',
                    callback: packaging(obj)
                };
            } else {
                obj.callback = packaging(obj.callback);
                return obj;
            }
        });
    }
    bind(component) {
        this.handlers.forEach((obj) => {
            if (obj.delegate) {

            } else {

            }
        });
    }
    unbind(component) {

    }
}

export default {
    data() {
        // 当前组件的引用变为当前部分的全局变量
        _self = this;
        return {
            exclusion: false
        };
    },
    methods: {
        /**
         * 对事件回调函数进行封装
         * 在运行回调之前插入一段矫正鼠标坐标的操作，并将结果传入实际的回调中
         * @param {function} fn
         * @returns {function} callback
         */
        toHandler(fn) {
            let last = false;
            return (e) => {
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
        },
        /**
         * 计算回调事件的队列
         * @param {array|object|function} args
         * @returns {array} queues
         */
        queues(args) {
            const queue = (args instanceof Array)
                ? args : [args];

            return queue.map((obj) => {
                if (obj instanceof Function) {
                    return {
                        type: 'mousemove',
                        callback: this.toHandler(obj)
                    };
                } else {
                    obj.callback = this.toHandler(obj.callback);
                    return obj;
                }
            });
        },
        EventControler(event) {
            // 如果有互斥事件在运行，且当前事件也是互斥的，那么忽略当前事件
            if (this.exclusion && event.exclusion) {
                return (false);
            } else {
                this.exclusion = !!event.exclusion;
            }

            // 设定鼠标指针
            const cursor = event.cursor ? `url(/cur/${event.cursor}.cur), crosshair` : 'default';
            // 回调事件队列
            const handlers = new Handler(event.handler, (fn) => this.toHandler(fn));

            // 起始事件
            event.beforeEvent = (event.beforeEvent || Promise.resolve)();
            // 生成终止事件
            if (!(this.stopEvent instanceof Function)) {
                event.stopEvent = mouseEvent(event.stopEvent);
            }

            // 事件回调生命周期
            event.beforeEvent
                // 绑定事件本身和结束条件
                .then(() => {
                    handlers.forEach((n) => this.$el.addEventListener(n.event, n.handler));
                    this.$el.style.cursor = cursor;
                    return event.stopEvent();
                })
                // 事件结束，解除事件绑定
                .then(() => {
                    handlers.forEach((n) => this.$el.removeEventListener(n.event, n.handler));
                    event.afterEvent && event.afterEvent();
                    this.exclusion = false;
                    // 全局鼠标指针恢复默认
                    this.$el.style.cursor = 'default';
                });
        }
    }
};
