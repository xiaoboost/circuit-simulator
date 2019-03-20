<script lang="ts" src="./index.ts"></script>

<template>
<transition name="fade">
    <footer class="action-menu" v-show="vision">
        <div v-if="isRun" class="fab-container">
            <div class="fab fab-text">{{ progress }} %</div>
        </div>
        <template v-else>
            <!-- 模拟运行 -->
            <div class="fab-container" @click="simulate">
                <a-icon class="fab" type="caret-right" />
            </div>
            <!-- 添加器件 -->
            <div class="fab-container" @click="addParts">
                <span class="fab-tip">添加器件</span>
                <a-icon class="fab" type="plus" />
            </div>
            <!-- 运行设置 -->
            <div class="fab-container" @click="setConfig">
                <span class="fab-tip">运行设置</span>
                <a-icon class="fab" type="setting" />
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
        height 44px
        width 44px
        opacity 0
        transition all 0.4s

    &:hover .fab-container .fab,
    &:hover .fab-container
        opacity 1

    .fab-container:nth-child(n+2)
        margin -8px 0em

    .fab-container:first-of-type .fab svg
        width 100%
        height 100%
        transform translate(3px, 1px)

    .fab-container:nth-child(n+2) .fab svg
        width 60%
        height 60%

    &:hover
        .fab-container:nth-child(n+2)
            margin 6px 0em
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
        margin 6px 0em

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
        left -10px
        padding 4px 8px
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
        font-size 14px
        opacity 0
        z-index 2

    .fab-container:hover .fab-tip
        opacity 1

    .fab-container:hover .fab
        box-shadow 0px 3px 5px rgba(0, 0, 0, 0.5)

    .fab
        height 56px
        width 56px
        border-radius 50%
        position relative
        overflow hidden
        box-shadow 0px 2px 3px rgba(0, 0, 0, 0.5)
        transition box-shadow 0.2s
        display flex
        justify-content center
        align-items center

    .fab:hover
        cursor pointer

    .fab-container .fab svg
        text-align center
        fill #FFFFFF
        stroke-width 0

    .fab-text
        color #fff
        font-size 17px
        font-family font-text
</style>
