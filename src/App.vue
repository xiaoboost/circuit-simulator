<template>
<main id="app">
    <start-loading :show="loading"></start-loading>
    <action-menu></action-menu>
    <drawing-main></drawing-main>
    <router-view></router-view>
</main>
</template>

<script>
import ActionMenu from '@/components/action-menu';
import DrawingMain from '@/components/drawing-main';
import StartLoading from '@/components/start-loading';

export default {
    name: 'app',
    data() {
        return {
            loading: true
        };
    },
    mounted() {
        window.onload = () => {
            console.log('Schematic Ready.');
            this.loading = false;
        };
    },
    components: {
        'drawing-main': DrawingMain,
        'start-loading': StartLoading,
        'action-menu': ActionMenu
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
