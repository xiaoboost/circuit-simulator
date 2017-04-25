<template>
<section class="drawing-main" :style="background" @mousewheel="mousewheel($event)">
    <svg height="100%" width="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <elec-part
                :ref="parts[i - 1].id"
                :key="parts[i - 1].id"
                v-model="parts[i - 1]"
                v-for="i in parts.length"
                @setEvent="EventControler">
            </elec-part>
            <elec-line
                :ref="lines[i - 1].id"
                :key="lines[i - 1].id"
                v-model="lines[i - 1]"
                v-for="i in lines.length"
                @setEvent="EventControler">
            </elec-line>
        </g>
    </svg>
</section>
</template>

<script>
import Part from '@/components/ElectronicPart';
import Line from '@/components/ElectronicLine';

import { $P } from '@/libraries/point';

export default {
    name: 'DrawingMain',
    components: {
        'elec-part': Part,
        'elec-line': Line
    },
    data() {
        return {
            zoom: 1,
            position: $P(0, 0)
        };
    },
    computed: {
        background() {
            const size = this.zoom * 20,
                biasX = this.position[0] % size,
                biasY = this.position[1] % size;

            return {
                'background-size': `${size}px`,
                'background-position': `${biasX}px ${biasY}px`
            };
        },
        parts() {
            return this.$store.state.collection.Parts;
        },
        lines() {
            return this.$store.state.collection.Lines;
        }
    },
    methods: {
        mousewheel(e) {
            const mousePosition = $P(e.pageX, e.pageY);
            let size = this.zoom * 20;

            if (e.deltaY > 0) {
                size -= 5;
            } else if (e.deltaY < 0) {
                size += 5;
            }

            if (size < 20) {
                size = 20;
                return (true);
            }
            if (size > 80) {
                size = 80;
                return (true);
            }

            this.position = this.position
                .add(-1, mousePosition)
                .mul(size / this.zoom / 20)
                .add(mousePosition)
                .round(1);

            this.zoom = size / 20;
        },
        find(id) {
            return this.$refs[id];
        },
        // 事件控制器
        EventControler(event) {
            // 给所有回调函数加上矫正鼠标坐标的钩子
            const toHandler = (fn) => {
                return (e) => {
                    const mousePosition = $P(
                        (e.pageX - this.position[0]) / this.zoom,
                        (e.pageY - this.position[1]) / this.zoom
                    );
                    fn(mousePosition, e);
                };
            };

            // 单个事件默认为 mousemove 事件
            const handlers = event.handler instanceof Function
                ? [{ event: 'mousemove', handler: toHandler(event.handler) }]
                : event.handler.forEach((n) => n.handler = toHandler(n.handler));

            // 默认起始事件
            event.beforeEvent = event.beforeEvent
                ? event.beforeEvent()
                : Promise.resolve();

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
                });
        }
    },
    mounted() {

    }
};
</script>
