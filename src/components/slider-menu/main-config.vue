<template>
<section class="slider-config">
    <header>
        <h1>模拟设置</h1>
        <h2>Simulation Settings</h2>
    </header>
    <article>
        <h1>
            <label>T</label>
            <span>时域模拟</span>
        </h1>
        <div class="form-line">
            <label>结束时间：</label>
            <v-input
                ref="end"
                v-model="end"
                :pattern="pattern"
                class="input-grow">
            </v-input>
            <span class="unit">秒</span>
        </div>
        <div class="form-line">
            <label>固定步长：</label>
            <v-input
                ref="step"
                v-model="step"
                :pattern="pattern"
                class="input-grow">
            </v-input>
            <span class="unit">秒</span>
        </div>
    </article>
</section>
</template>

<script lang="ts">
import Input from 'src/components/input-verifiable';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'v-input': Input,
    },
})
export default class Config extends Vue {
    pattern = Number.SCIMatch;
    end: string = this.$store.state.END_TIME;
    step: string = this.$store.state.STEP_TIME;

    // beforeRouteLeave(to, from, next) {
    //     if (this.$refs['end'].check() && this.$refs['step'].check()) {
    //         this.$store.commit('SET_END_TIME', this.end);
    //         this.$store.commit('SET_STEP_TIME', this.step);
    //         next();
    //     }
    // },
}
</script>

<style lang="stylus">
@import '../../css/Variable'

left = 35px

.slider-config article
    h1
        font-size 25px
        line-height 1.5
        font-weight normal

        label
            font-family font-serif
            position absolute
            color Silver
        span
            margin-left left
            color Black

    .form-line
        display flex
        margin 15px 10px 15px left

        label
            white-space nowrap
        .input-grow
            flex-grow 1
            margin-right 10px
</style>
