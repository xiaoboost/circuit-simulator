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
