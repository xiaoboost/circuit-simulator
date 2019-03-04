<script lang="ts" src="./index.ts"></script>

<template>
<g :class="['line', { focus }]">
    <path :d="way2path"></path>
    <rect
        class="line-rect"
        v-for="(rect, i) in pathRects"
        :key="i + 2" :x="rect.x" :y="rect.y"
        :height="rect.height" :width="rect.width">
    </rect>
    <electronic-point
        v-for="(point, i) in points"
        :key="i" :r="point.size"
        :class-list="['line-point', point.class]"
        :transform="`translate(${point.position.join()})`"
        @mousedown.native.stop.left.passive="drawing(i)">
    </electronic-point>
</g>
</template>
