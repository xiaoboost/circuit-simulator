<template>
<section>
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
import { TimeConfig } from 'src/vuex';
import InputComp from 'src/components/input-verifiable';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {
        'v-input': InputComp,
    },
})
export default class Config extends Vue implements TimeConfig {
    pattern = Number.SCIENTIFIC_COUNT_MATCH;

    end: string;
    step: string;

    $refs: {
        step: InputComp,
        end: InputComp,
    };

    get storeTime(): TimeConfig {
        return this.$store.state.time;
    }

    check() {
        if (!this.$refs.end.validate() || !this.$refs.step.validate()) {
            return false;
        }

        if (
            this.end !== this.storeTime.end ||
            this.step !== this.storeTime.step
        ) {
            this.$store.commit('SET_TIME_CONFIG', {
                step: this.step,
                end: this.end,
            });
        }

        return true;
    }

    @Watch('storeTime')
    init() {
        this.end = this.storeTime.end;
        this.step = this.storeTime.step;
    }

    created() {
        this.init();
    }
}
</script>

<style lang="stylus" scoped>
@import '../../css/variable'

left = 35px

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
