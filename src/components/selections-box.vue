<template>
<g class="selections-box">
    <polygon :points="points"></polygon>
</g>
</template>

<script>
import { $P } from '@/libraries/point';

export default {
    props: {
        location: {
            type: Array || Boolean,
            default: () => [$P(), $P()],
        },
    },
    data() {
        return {
            // ..
        };
    },
    computed: {
        points() {
            const s = this.location[0], m = this.location[1];
            return `${s.join()} ${m[0]},${s[1]} ${m.join()} ${s[0]},${m[1]}`;
        },
    },
    methods: {
        // ..
    },
};
</script>

<style lang="stylus">

</style>
