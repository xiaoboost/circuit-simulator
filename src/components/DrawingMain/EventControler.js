import { $P } from '@/libraries/point';

// 生成鼠标点击左键 / 右键的 promise 实例
function mouseEvent($event) {
    const code = { left: 0, right: 2 };
    return () => new Promise((res) => {
        $event.el.addEventListener($event.name, function stop(event) {
            if (event.button === code[$event.which]) {
                $event.el.removeEventListener($event.name, stop);
                res();
            }
        });
    });
}

export default {
    data() {
        return {
            exclusion: false
        };
    },
    methods: {
        toHandler(fn) {
            let last = false;
            return (e) => {
                const origin = $P(e.pageX, e.pageY),
                    mouse = origin
                        .add(-1, this.position)
                        .mul(1 / this.zoom),
                    bias = last
                        ? origin.add(-1, last)
                        : $P(0, 0);

                last = origin;
                fn({ mouse, bias }, e);
            };
        },
        EventControler(event) {
            // 如果有互斥事件在运行，那么忽略当前事件
            if (this.exclusion) {
                return (false);
            } else {
                this.exclusion = event.exclusion;
            }

            // 单个事件默认为 mousemove 事件
            const handlers = event.handler instanceof Function
                ? [{ event: 'mousemove', handler: this.toHandler(event.handler) }]
                : event.handler.forEach((n) => n.handler = this.toHandler(n.handler));

            // 默认起始事件
            event.beforeEvent = event.beforeEvent
                ? event.beforeEvent()
                : Promise.resolve();
            // 终止事件
            event.stopEvent = this.stopEvent instanceof Function
                ? event.stopEvent
                : mouseEvent(event.stopEvent);

            // 事件开始
            event.beforeEvent
                // 绑定事件本身和结束条件
                .then(() => {
                    handlers.forEach((n) => this.$el.addEventListener(n.event, n.handler));
                    return event.stopEvent();
                })
                // 事件结束，解除事件绑定
                .then(() => {
                    handlers.forEach((n) => this.$el.removeEventListener(n.event, n.handler));
                    event.afterEvent();
                    this.exclusion = false;
                });
        }
    }
};
