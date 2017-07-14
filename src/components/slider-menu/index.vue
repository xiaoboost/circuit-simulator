<template>
<transition
    name="move-slide"
    @before-enter="beforeEnter"
    @after-leave="afterLeave">
    <aside class="slider" v-show="vision">
        <add-parts v-show="isAddParts"></add-parts>
        <main-config v-show="isMainConfig"></main-config>
        <div v-show="isAddParts" @click="close" class="close-button"><span></span></div>
        <div v-show="isMainConfig" @click="close" class="gray-cover"></div>
    </aside>
</transition>
</template>

<script>
import AddParts from './add-parts';
import MainConfig from './main-config';

export default {
    name: 'Slider',
    components: {
        AddParts,
        MainConfig,
    },
    data() {
        return {
            isAddParts: false,
            isMainConfig: false,
        };
    },
    computed: {
        page() {
            return this.$store.state.page;
        },
        vision() {
            return this.page && this.page !== 'graph';
        },
    },
    methods: {
        close() {
            this.$store.commit('SET_PAGE', '');
        },
        beforeEnter() {
            this.isAddParts = (this.page === 'add-parts');
            this.isMainConfig = (this.page === 'main-config');
        },
        afterLeave() {
            this.isAddParts = false;
            this.isMainConfig = false;
        },
    },
};
</script>

<style lang="stylus">
@import '../../css/Variable'

time = .4s
width = 380px
size = 50px

.slider
    section
        position fixed
        height 100%
        width width
        top 0
        right 0
        z-index 20
        background-color White
        box-shadow -5px 0 15px Shadow
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
    header
        color White
        text-align  center
        background-color Blue
        padding 1px 0
        font-family font-serif

        > *
            font-weight normal
            margin 20px
        h1
            font-size 40px
        h2
            font-size 25px
    article
        margin 10px 20px
        color Black

// 动画设定
.move-slide-enter-active,
.move-slide-leave-active
    transition opacity time
    section
        transition transform time
    .close-button
        transition transform time, right time

.move-slide-enter,
.move-slide-leave-to
    opacity 0
    section
        transform translateX(100%)
    .close-button
        transform scale(.5, .5)
        right 0
</style>
