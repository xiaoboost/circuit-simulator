<script lang="ts" src="./index.ts"></script>

<template>
<section id="parts-panel">
    <header class="sidebar-title">
        <h1>添加器件</h1>
        <h2>Add Parts</h2>
    </header>
    <article class="sidebar-body">
        <div
            v-for="(category, i) in categories"
            class="parts-list"
            :key="i">
            <a-tooltip
                v-for="part in category.parts"
                :key="part"
                placement="top">
                <span slot="title">{{ getIntro(part) }}</span>
                <span
                    class="part-item"
                    @click.passive.left="createPart(part)">
                    <svg x="0px" y="0px" viewBox="0 0 80 80">
                        <part-show v-once :type="part" />
                    </svg>
                </span>
            </a-tooltip>
        </div>
    </article>
</section>
</template>

<style lang="stylus" scoped>
@import '../../../css/variable'

#parts-panel
    .tool-tip
        display none
        position fixed
        padding 5px
        margin 6px
        background #d9edf7
        color #3f8aaf
        font-family font-text
        box-shadow 0 0 2px Shadow
        border-radius 3px
        height auto
        font-size 16px
        transform translate(-100%, -100%)

    .parts-list
        margin 20px 0

    .part-item
        height 66px
        width 66px
        margin 0 10px
        padding 0
        outline 0
        background #f2f2f2
        border-radius 5px
        border 1px solid Gray
        box-shadow 0 0 3px Shadow
        display inline-block
        transition all .3s cubic-bezier(.3,.3,.1,1)
        &:hover
            background White
        &:focus
            background White
            border 1px solid Light-Blue
            box-shadow 0 0 3px Light-Blue
        svg
            height 58px
            width 58px
            margin 3px
            stroke Black
            stroke-width 2
            stroke-linecap round
            fill transparent

            .fill-white
                fill White
            .fill-black
                fill Black
            path
                stroke-width 2
            rect,
            polygon.fill-black
                stroke-width 0
</style>
