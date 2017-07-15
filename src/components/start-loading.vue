<template>
<transition name="fade">
    <section v-if="show" class="start-loading">
        <div>
            <h3 style="font-style: italic;">加载中……</h3>
            <svg class="spinner" width="55px" height="55px" viewBox="0 0 66 66">
                <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
            <h3>绘制草图·模拟</h3>
        </div>
    </section>
</transition>
</template>

<script>
export default {
    name: 'StartLoading',
    props: {
        show: {
            type: Boolean,
            default: true,
        },
    },
};
</script>

<style lang="stylus">
@import '../css/Variable'

.start-loading
    position absolute
    background rgba(20, 20, 20, 0.95)
    height 100%
    width 100%
    z-index 10
    opacity 1
    transition opacity 200ms linear
    > div
        border-radius 25px
        background-color #222
        box-shadow 0 0 10px #000000
        position absolute
        top 0
        left 0
        right 0
        bottom 0
        margin auto
        width 200px
        height 180px
        text-align center
        h3
            font-family font-text
            margin 0
            padding 0
            font-size 18px
            font-weight normal
            line-height 60px
            color #999
            text-shadow 1px 1px 2px black

.start-loading .spinner
    animation rotator 1.4s linear infinite
    .path
        stroke-dasharray 187
        stroke-dashoffset 0
        transform-origin center
        animation dash 1.4s ease-in-out infinite,
                  colors 5.6s ease-in-out infinite

// fade-enter-active过程不需要渐变
.fade-leave-active
    transition opacity .5s

.fade-enter,
.fade-leave-active
    opacity: 0

@keyframes colors
    0%
        stroke #4285F4
    25%
        stroke #DE3E35
    50%
        stroke #F7C223
    75%
        stroke #1B9A59
    100%
        stroke #4285F4

@keyframes dash
    0%
        stroke-dashoffset 187
    50%
        stroke-dashoffset 46.75
        -webkit-transform rotate(135deg)
        transform rotate(135deg)
    100%
        stroke-dashoffset 187
        -webkit-transform rotate(450deg)
        transform rotate(450deg)
</style>
