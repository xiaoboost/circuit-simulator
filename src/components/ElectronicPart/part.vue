<template>
<g class="part">
    
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
            position: [Infinity, Infinity],

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

        }
    },
    mounted() {
        // 展开数据
        Object.assign(this, this.value);
        // 外观属性
        this.shape = Electronics[this.type].readOnly;
        // 将旋转矩阵以及坐标实例化
        this.rotate = $M(this.rotate);
        this.position = $M(this.position);
        // 如果坐标为无限，说明是新建器件
        if (this.position[0] === Infinity) {
            this.setNewEvevt();
        }
    }
};
</script>
