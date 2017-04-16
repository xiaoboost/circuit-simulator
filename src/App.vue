<template>
<main id="app">
    <start-loading :show="loading"></start-loading>
    <action-menu></action-menu>
    <drawing-main></drawing-main>
    <router-view></router-view>
</main>
</template>

<script>
import StartLoading from '@/components/StartLoading.vue';
import DrawingMain from '@/components/DrawingMain.vue';
import ActionMenu from '@/components/ActionMenu.vue';

export default {
    name: 'app',
    data() {
        return {
            loading: true
        };
    },
    mounted() {
        window.onload = () => {
            console.log('App Ready.');
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
@import './css/Variable'
@import './css/Public'
@import './css/DrawingMain'

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
