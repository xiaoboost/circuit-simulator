<script lang="ts" src="./index.ts"></script>

<template>
<g
    class="part"
    :style="style"
    :transform="`matrix(${rotate.join()},${position.join()})`"
    @dblclick.passive="setParams">
    <g class="part-focus">
        <part-shape
            :value="origin.shape"
            @mousedown.stop.left.passive="clickHandler"
        />
        <electronic-point
            v-for="(point, i) in points"
            :key="i"
            :r="point.size"
            :classList="['part-point', point.class]"
            :transform="`translate(${point.originPosition.join()})`"
            @mousedown.native.stop.left.passive="setDrawLine(i)"
        />
    </g>
    <g
        v-if="showText"
        @mousedown.stop.left.passive="moveText"
        :class="`text-params text-placement-${textPlacement}`"
        :transform="`matrix(${invRotate.join()},${textPosition.rotate(invRotate).join()})`">
        <text>
            <tspan>{{ id.split('_')[0] }}</tspan>
            <tspan dx="-4">{{ id.split('_')[1] }}</tspan>
        </text>
        <text
            v-for="(txt, i) in texts"
            :key="i" :dy="16 * (i + 1)"
            v-text="txt"
        />
    </g>
</g>
</template>
