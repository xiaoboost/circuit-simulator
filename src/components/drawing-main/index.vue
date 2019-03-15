<script lang="ts" src="./index.ts"></script>

<template>
<section
    id="drawing-main"
    :style="backgroundStyle"
    :class="{ 'no-event': !exclusion }">
    <!--
        SVG 元素中的鼠标事件不可设置为停止冒泡
        因为全局禁止原生的右键菜单必须要等这个几个鼠标事件冒泡
    -->
    <svg
        version="2" height="100%" width="100%"
        xmlns="http://www.w3.org/2000/svg"
        @mousedown.self.right.passive="moveMap"
        @mousedown.self.left.passive="() => devicesNow = []"
        @click.self.right.passive="openRightMenu"
        @wheel.passive="resizeMap">
        <g :transform="`translate(${position.join(',')}) scale(${zoom})`">
            <line-component v-for="line in linesAll" :key="line.hash" :value="line"></line-component>
            <part-component v-for="part in partsAll" :key="part.hash" :value="part"></part-component>
        </g>
    </svg>
</section>
</template>

<style lang="stylus">
@import '../../css/variable'

#drawing-main
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-image url(/img/circuit-grid.svg)
    background-size 20px
    background-position -40px -40px
    background-repeat repeat
    user-select none
    cursor default
    outline none
    svg
        height 100%
        width 100%
        overflow hidden
        position relative
        stroke Black
        stroke-width 2
        stroke-linecap round
        fill transparent

#drawing-main
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-image url(/img/circuit-grid.svg)
    background-size 20px
    background-position -40px -40px
    background-repeat repeat
    user-select none
    cursor default
    outline none
    svg
        height 100%
        width 100%
        overflow hidden
        position relative
        stroke Black
        stroke-width 2
        stroke-linecap round
        fill transparent

// 器件导线公共属性
#drawing-main g
    path
        stroke Black
        stroke-width 2
    rect
        fill transparent
        stroke transparent
    .fill-white
        fill White
    .fill-black
        fill Black
    polygon.fill-black
        stroke-width 0
    text
        fill Black
        font-size 16px
        font-family font-text
        stroke-width 0
        tspan:nth-child(2)
            font-size 10px
    .part-point,
    .line-point
        circle
            fill Black
    .line-point-open
        circle
            fill White
            stroke-dasharray 1.5,4
            transition stroke-dasharray 200ms cubic-bezier(.4,1.3,1,1)
        &:hover circle
            stroke-dasharray 3,4
    .text-params
        text, tspan
            white-space nowrap
        &.text-placement-top,
        &.text-placement-bottom
            text-anchor middle
        &.text-placement-left
            text-anchor end
        &.text-placement-right
            text-anchor start

// 器件导线公共属性（被选中状态）
#drawing-main g.focus
    path, .fill-white,
    g.line-point circle
        stroke Dark-Green
    text, .fill-black,
    g.line-point.line-point-cross circle
        fill Dark-Green
    g.part-point circle
        stroke Dark-Green
        fill Dark-Green

#drawing-main.no-event
    .part
        &:hover
            cursor url(/cur/move_part.cur), crosshair
        .part-point-open:hover
            cursor url(/cur/draw_line.cur), crosshair
        .part-point-close:hover
            cursor url(/cur/close_point.cur), crosshair

    .line
        .line-rect:hover
            cursor url(/cur/move_part.cur), crosshair
        .line-point-open:hover
            cursor url(/cur/draw_line.cur), crosshair
</style>
