import { $P } from '@/libraries/point';

export default {
    data() {
        return {
            exclusion: false
        };
    },
    methods: {
        mouseEvent($event) {
            const code = { left: 0, right: 2 };
            return () => new Promise((resolve) => {
                $event.el.addEventListener($event.name, function stop(event) {
                    if (event.button === code[$event.which]) {
                        $event.el.removeEventListener($event.name, stop);
                        // 将终止事件时的鼠标坐标向下传递
                        resolve(
                            $P(event.pageX, event.pageY)
                                .add(-1, this.position).mul(1 / this.zoom)
                        );
                    }
                });
            });
        },
        toHandler(fn) {
            let last = false;
            return (e) => {
                const origin = $P(e.pageX, e.pageY),
                    mouse = origin.add(-1, this.position).mul(1 / this.zoom),
                    bias = last
                        ? origin.add(-1, last).mul(1 / this.zoom)
                        : $P(0, 0);

                last = origin;
                fn({ mouse, bias }, e);
            };
        },
        EventControler(event) {
            // 如果有互斥事件在运行，且当前事件也是互斥的，那么忽略当前事件
            if (this.exclusion && event.exclusion) {
                return (false);
            } else {
                this.exclusion = !!event.exclusion;
            }

            const cursor = event.cursor
                    ? `url(/cur/${event.cursor}.cur), crosshair` : 'default',
                // 单个事件默认为 mousemove 事件
                handlers = event.handler instanceof Function
                    ? [{ event: 'mousemove', handler: this.toHandler(event.handler) }]
                    : event.handler.forEach((n) => n.handler = this.toHandler(n.handler));

            // 默认起始事件
            event.beforeEvent = event.beforeEvent
                ? event.beforeEvent()
                : Promise.resolve();
            // 终止事件
            event.stopEvent = this.stopEvent instanceof Function
                ? event.stopEvent
                : this.mouseEvent(event.stopEvent);

            // 事件开始
            event.beforeEvent
                // 绑定事件本身和结束条件
                .then(() => {
                    handlers.forEach((n) => this.$el.addEventListener(n.event, n.handler));
                    this.$el.style.cursor = cursor;
                    return event.stopEvent();
                })
                // 事件结束，解除事件绑定
                .then((mouse) => {
                    handlers.forEach((n) => this.$el.removeEventListener(n.event, n.handler));
                    event.afterEvent && event.afterEvent(mouse);
                    this.exclusion = false;
                    // 全局鼠标指针恢复默认
                    this.$el.style.cursor = 'default';
                });
        }
    }
};
