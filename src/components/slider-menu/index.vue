<template>
<transition
    name="move-slide"
    @before-enter="beforeEnter"
    @after-leave="afterLeave">
    <aside class="slider" v-show="vision">
        <add-parts v-show="showAddParts"></add-parts>
        <main-config v-show="showMainConfig"></main-config>
        <div v-show="showAddParts" @click="close" class="close-button"><span></span></div>
        <div v-show="showMainConfig" @click="close" class="gray-cover"></div>
    </aside>
</transition>
</template>

<script lang="ts">
import AddParts from './add-parts.vue';
import MainConfig from './main-config.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        AddParts,
        MainConfig,
    },
})
export default class Slider extends Vue {
    showAddParts = false;
    showMainConfig = false;

    get isAddParts(): boolean {
        return this.$store.getters.isAddParts;
    }
    get isMainConfig(): boolean {
        return this.$store.getters.isMainConfig;
    }
    get vision(): boolean {
        return (this.isAddParts || this.isMainConfig);
    }

    close(): void {
        this.$store.commit('CLOSE_SLIDER');
    }
    beforeEnter(): void {
        this.showAddParts = this.isAddParts;
        this.showMainConfig = this.isMainConfig;
    }
    afterLeave(): void {
        this.showAddParts = false;
        this.showMainConfig = false;
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

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
    /deep/ header
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
    /deep/ article
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
