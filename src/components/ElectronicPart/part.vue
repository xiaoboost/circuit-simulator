<template>
<g class="part" :transform="`matrix(${rotate.join()},${position.join()})`">
    器件
</g>
</template>

<script>
import { $P } from '@/libraries/point';
import { $M } from '@/libraries/matrix';
import { Electronics } from './Shape';

export default {
    props: {
        value: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            id: '',
            type: '',
            params: [],
            rotate: [[1, 0], [0, 1]],
            position: [500000, 500000],

            shape: {}
        };
    },
    methods: {
        update() {
            this.$emit('input', {
                id: this.id,
                type: this.type,
                rotate: this.rotate,
                params: this.params,
                position: this.position
            });
        },
        setNewEvevt() {
            const el = this.$el,
                parentEl = this.$parent.$el,
                beforeEvent = () => el.setAttribute('opacity', '0.4'),
                event = (e) => this.position = e,
                stopEvent = () => {
                    parentEl.addEventListener('click', function stop(event) {
                        debugger;
                        if (!event.button) {
                            parentEl.removeEventListener('click', stop);
                            el.removeAttribute('opacity');
                        }
                    });
                };

            this.$emit('setEvent', {
                event,
                beforeEvent,
                stopEvent
            });
        }
    },
    mounted() {
        // 展开数据
        Object.assign(this, this.value);
        // 外观属性
        this.shape = Electronics[this.type].readOnly;
        // 将旋转矩阵以及坐标实例化
        this.rotate = $M(this.rotate);
        this.position = $P(this.position);
        // 如果坐标为无限，说明是新建器件
        if (this.position[0] === 500000) {
            this.setNewEvevt();
        }
    }
};
</script>
