<script lang="ts" src="./index.ts"></script>

<template>
<transition
    name="move-slide"
    @beforeEnter="beforeEnter"
    @afterLeave="afterLeave">
    <aside id="slider" v-show="vision">
        <parts-panel ref="parts" v-show="partsPanelDelay"></parts-panel>
        <config-panel ref="config" v-show="configPanelDelay"></config-panel>
        <div
            class="close-button"
            v-show="partsPanelDelay"
            @click="close">
            <span></span>
        </div>
        <div
            class="gray-cover"
            v-show="configPanelDelay"
            @click="close">
        </div>
    </aside>
</transition>
</template>

<style lang="stylus" scoped>
@import '../../../css/variable'

time = .4s
width = 380px
size = 50px

#slider
    .gray-cover
        position fixed
        height 100%
        width 100%
        top 0
        left 0
        z-index 10
        background-color Gray-Transparent
    .close-button
        position absolute
        width size
        height size
        top 150px - (size / 2)
        right width - (size / 2)
        background-color Yellow
        border-radius 50%
        z-index 20
        box-shadow -2px 0 10px Shadow
        cursor pointer

        span::before,
        span::after
            content ''
            height 5px
            width 30px
            position absolute
            background White
        span::before
            transform translate(10px, 22.5px) rotate(45deg)
        span::after
            transform translate(10px, 22.5px) rotate(135deg)
    
    section
        position fixed
        height 100%
        width width
        top 0
        right 0
        z-index 20
        background-color White
        box-shadow -5px 0 15px Shadow

        /deep/ .sidebar-title
            text-align  center
            background-color Blue
            padding 1px 0
            font-family font-serif

            > *
                color White
                font-weight normal
                margin 20px
            h1
                font-size 35px
                line-height 1.5
            h2
                font-size 25px
                line-height 1.5

        /deep/ .sidebar-body
            margin 10px 20px
            color Black

#slider.move-slide-enter-active,
#slider.move-slide-leave-active
    transition opacity time
    section
        transition transform time
    .close-button
        transition transform time, right time

#slider.move-slide-enter,
#slider.move-slide-leave-to
    opacity 0
    section
        transform translateX(100%)
    .close-button
        transform scale(.5, .5)
        right -(size / 2)
</style>
