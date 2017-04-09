<template>
<main id="app">
    <drawing-main></drawing-main>
    <router-view></router-view>
</main>
</template>

<script>
import DrawingMain from '@/components/DrawingMain.vue';

export default {
    name: 'app',
    components: {
        'drawing-main': DrawingMain
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
  color color-font
  font-family font-default
  font-size 16px
  font-smoothing()
</style>
