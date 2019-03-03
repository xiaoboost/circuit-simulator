<script lang="ts" src="./index.ts"></script>

<template>
<transition name="fade">
    <footer class="action-menu" v-show="vision">
        <div v-if="isRun" class="fab-container">
            <div class="fab" id="fab-text"></div>
        </div>
        <template v-else>
            <div
                class="fab-container"
                v-for="icon in icons"
                :key="icon.name"
                @click="action(icon.name)">
                <span
                    v-if="icon.intro"
                    class="fab-tip"
                    v-text="icon.intro">
                </span>
                <div class="fab">
                    <svg :viewBox="`0 0 ${icon.long} ${icon.long}`">
                        <g :transform="`translate(${icon.translate(zoom)}) scale(${zoom}, ${zoom})`">
                            <path :d="icon.d"></path>
                        </g>
                    </svg>
                </div>
            </div>
        </template>
    </footer>
</transition>
</template>

<style lang="stylus" scoped>
@import '../../css/variable'

.action-menu
    position fixed
    bottom 0px
    right 8px
    display flex
    flex-direction column-reverse
    align-items center
    padding 30px
    z-index 6

    .fab-container:nth-child(n+2),
    .fab-container:nth-child(n+2) .fab
        height 2.8em
        width 2.8em
        opacity 0
        transition all 0.4s

    &:hover .fab-container .fab,
    &:hover .fab-container
        opacity 1

    .fab-container:nth-child(n+2)
        margin -0.5em 0em

    &:hover
        .fab-container:nth-child(n+2)
            margin .35em 0em
        .fab-container:nth-child(2)
            transition-delay 0
        .fab-container:nth-child(3)
            transition-delay .03s
        .fab-container:nth-child(4)
            transition-delay .06s
        .fab-container:nth-child(5)
            transition-delay .09s
        .fab-container:nth-child(6)
            transition-delay .12s
        .fab-container:nth-child(7)
            transition-delay .125s

    .fab-container
        position relative
        margin .35em 0em

    .fab-container:first-of-type .fab
        background #66CCCC

    .fab-container:nth-child(2) .fab
        background #2196F3

    .fab-container:nth-child(3) .fab
        background #E53935

    .fab-container:nth-child(4) .fab
        background #f8985c

    .fab-container:nth-child(5) .fab
        background #43A047

    .fab-container:nth-child(n+2) .fab-tip
        position absolute
        top 50%
        left -0.7em
        padding .3em .5em
        border-radius 2px
        transform-origin right
        transform translate(-100%, -50%)
        transition opacity 0.4s
        white-space nowrap
        height auto
        width auto
        background #757575
        color #F5F5F5
        font-weight 300
        font-size .9em
        opacity 0
        z-index 2

    .fab-container:hover .fab-tip
        opacity 1

    .fab-container:hover .fab
        box-shadow 0px 3px 5px rgba(0, 0, 0, 0.5)

    .fab
        height 3.5em
        width 3.5em
        border-radius 50%
        position relative
        overflow hidden
        box-shadow 0px 2px 3px rgba(0, 0, 0, 0.5)
        transition box-shadow 0.2s

    .fab:hover
        cursor pointer

    .fab-container .fab svg
        text-align center
        fill #FFFFFF
        stroke-width 0

</style>
