<template>
<div class="drawing-main">
    <svg height="100%" width="100%" version="1.1" :xmlns="SVG_NS">
        <g id="area-of-parts">
        </g>
    </svg>
</div>
</template>

<script>
export default {
    name: 'DrawingMain',
    data() {
        return {
            //
        };
    },
    computed: {
        SVG_NS() {
            return this.$store.state.SVG_NS;
        }
    }
};
</script>
