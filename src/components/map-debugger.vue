<template>
<g class="map-debugger">
    <circle
        v-for="(item, i) in points"
        fill="transparent" stroke-width="3" r="3"
        :cx="item.x" :cy="item.y" :key="i" :class="item.class">
    </circle>
    <path
        v-for="(item, i) in lines" :key="i"
        fill="transparent" stroke-width="2"
        :d="'M' + item.way.map((p) => p.join(',')).join('L')" :class="item.class">
    </path>
    <text
        v-for="(item, i) in lines"
        fill="#3B4449" stroke-width="0" font-size="14"
        :x="item.x" :y="item.y" :key="i" :class="item.class">
        {{ item.text }}
    </text>
</g>
</template>

<script>
export default {
    name: 'MapDebugger',
    data() {
        return {
            lines: [],
            texts: [],
            points: [],
        };
    },
    methods: {
        addPoint(point) {
            point.class = point.class || '';
            this.points.push(point);
        },
        addPath(path) {
            path.class = path.class || '';
            this.lines.push(path);
        },
        addText(text) {
            text.class = text.class || '';
            this.texts.push(text);
        },
        clearAll() {
            this.lines = [];
            this.texts = [];
            this.points = [];
        },
        clearPoints() {
            this.points = [];
        },
        clearTexts() {
            this.texts = [];
        },
        clearPath() {
            this.lines = [];
        },
        whole() {

        },
    },
};
</script>

<style lang="stylus">

</style>
