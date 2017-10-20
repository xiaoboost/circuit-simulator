<template>
<main id="app">
    {{ msg }}
    <!-- <drawing-main></drawing-main>
    <slider-menu></slider-menu>
    <action-menu></action-menu> -->
</main>
</template>

<script lang="ts">
import * as deco from 'vue-property-decorator';

// import ActionMenu from 'src/components/action-menu';
// import SliderMenu from 'src/components/slider-menu';
// import DrawingMain from 'src/components/drawing-main';

@deco.Component
export default class Main extends deco.Vue {
    // components: {
    //     ActionMenu,
    //     SliderMenu,
    //     DrawingMain,
    // };
    msg = '初始页面';
};
</script>
