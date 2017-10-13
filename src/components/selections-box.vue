<template>
<transition name="fade">
    <g class="selections-box">
        <polygon :points="points" :stroke-width="1.5 / zoom"></polygon>
    </g>
</transition>
</template>

<script>
import { $P } from 'src/lib/point';

export default {
    props: {
        location: {
            type: [Array, Boolean],
            default: () => [$P(), $P()],
        },
    },
    data() {
        return {
            // ..
        };
    },
    computed: {
        zoom() {
            return this.$store.state.drawing.zoom;
        },
        points() {
            const s = this.location[0] || [0, 0], m = this.location[1] || s;
            return `${s.join()} ${m[0]},${s[1]} ${m.join()} ${s[0]},${m[1]}`;
        },
    },
    methods: {
        // ..
    },
};
</script>
