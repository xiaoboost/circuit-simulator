<template>
<main id="app">
    <start-loading></start-loading>
    <drawing-main></drawing-main>
    <slider-menu></slider-menu>
    <action-menu></action-menu>
</main>
</template>

<script>
import ActionMenu from '@/components/action-menu';
import SliderMenu from '@/components/slider-menu';
import DrawingMain from '@/components/drawing-main';
import StartLoading from '@/components/start-loading';

export default {
    name: 'app',
    components: {
        ActionMenu,
        SliderMenu,
        DrawingMain,
        StartLoading
    }
};
</script>

<style lang="stylus">
@import './css/variable'
@import './css/public'
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
