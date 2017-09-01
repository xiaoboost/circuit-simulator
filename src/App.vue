<template>
<main id="app">
    <drawing-main></drawing-main>
    <slider-menu></slider-menu>
    <action-menu></action-menu>
</main>
</template>

<script>
import ActionMenu from '@/components/action-menu';
import SliderMenu from '@/components/slider-menu';
import DrawingMain from '@/components/drawing-main';

export default {
    name: 'main',
    components: {
        ActionMenu,
        SliderMenu,
        DrawingMain,
    },
};
</script>

<style lang="stylus">
@import './css/variable'
@import './css/public'
@import './css/start-loading'
@import './css/drawing-main'

html, body, #app
    overflow hidden
    width 100%
    height 100%
    user-select none
    cursor default
    color Black
    font-family font-default
    font-size 16px
    font-smoothing()
</style>
