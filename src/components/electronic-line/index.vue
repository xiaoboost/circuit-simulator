<template>
<g
    :class="['line', { 'focus': focus }]">
    <path :d="way2path"></path>
</g>
</template>

<script>
import { $M } from '@/libraries/matrix';

export default {
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        focus: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            way: [],
            connect: []
        };
    },
    computed: {
        way2path() {
            return 'M' + this.way.map((n) => n.join(',')).join('L');
        },
        pathRects() {
            return false;
        }
    },
    method: {
        startDrawing() {
            this.$emit('focus', this.id, this.connect[0]);
        }
    },
    mounted() {
        // 展开数据
        Object.assign(this, this.value);
        // 路径只有一个点，绘制新导线
        if (this.way.length === 1) {
            this.startDrawing();
        }
    },
};
</script>
