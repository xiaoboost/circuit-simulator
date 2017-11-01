<template>
<main id="app">
    <!-- <drawing-main></drawing-main> -->
    <slider-menu></slider-menu>
    <action-menu></action-menu>
</main>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionMenu from 'src/components/action-menu';
import SliderMenu from 'src/components/slider-menu';
// import DrawingMain from 'src/components/drawing-main';

export default Vue.extend({
    name: 'Main',
    components: {
        ActionMenu,
        SliderMenu,
        // DrawingMain,
    },
});
</script>
