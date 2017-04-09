<template>
<transition name="move-slide">
    <main class="slider">
        <aside>
            <router-view></router-view>
        </aside>

        <div v-if="isAddParts" @click="close" class="close-button" key="0">
            <span></span>
        </div>
        <div v-else @click="close" class="gray-cover" key="1"></div>
    </main>
</transition>
</template>

<script>
export default {
    name: 'Slider',
    computed: {
        isAddParts() {
            return this.$route.name === 'AddParts';
        }
    },
    methods: {
        close() {
            this.$router.push('/');
        }
    }
};
</script>

<style lang="stylus">
@import '../../css/Variable'

time = .4s
width = 380px
size = 50px

.slider
    // 侧边栏
    aside
        position fixed
        height 100%
        width width
        top 0
        right 0
        z-index 20
        background-color color-white
        box-shadow -5px 0 15px #a1a1a1
    // 灰色遮罩
    .gray-cover
        position fixed
        height 100%
        width 100%
        top 0
        left 0
        z-index 10
        background-color rgba(0, 0, 0, .2)
    .close-button
        position absolute
        width size
        height size
        top 150px - (size / 2)
        right width - (size / 2)
        background color-green
        border-radius 50%
        z-index 20
        box-shadow -2px 0 10px #a1a1a1
        cursor pointer
        span:before,
        span:after
            background color-white
            content ''
            height 5px
            width 30px
            position absolute
        span:before
            transform translate(10px, 22.5px) rotate(45deg)
        span:after
            transform translate(10px, 22.5px) rotate(135deg)
    header
        color: color-white;
        text-align: center;
        background-color: color-blue;
        padding 1px 0
        font-family font-serif
        > *
            font-weight normal
            margin 20px
        h1
            font-size 40px
        h2
            font-size 25px
    section
        margin 10px 20px
        color color-font
        h1
            font-weight normal
            font-size 25px
            margin 10px 1em

// 动画设定
.move-slide-enter-active
.move-slide-leave-active
    transition opacity time
    aside
        transition transform time
    .close-button
        transition transform time, right time
.move-slide-enter,
.move-slide-leave-active
    opacity 0
    aside
        transform translateX(100%)
    .close-button
        transform scale(.5, .5)
        right 0
</style>
