<template>
<main class="slider-config">
    <header>
        <h1>模拟设置</h1>
        <h2>Simulation Settings</h2>
    </header>
    <section>
        <h1>
            <label>T</label>
            <span>时域模拟</span>
        </h1>
        <div class="form-line">
            <label>结束时间：</label>
            <v-input ref="end" v-model="end" :pattern="NUM_REG" class="input-grow"></v-input>
            <span class="unit">秒</span>
        </div>
        <div class="form-line">
            <label>固定步长：</label>
            <v-input ref="step" v-model="step" :pattern="NUM_REG" class="input-grow"></v-input>
            <span class="unit">秒</span>
        </div>
    </section>
</main>
</template>

<script>
import Input from '@/components/InputVerifiable.vue';

export default {
    name: 'Config',
    data() {
        const state = this.$store.state;

        return {
            end: state.time.END_TIME,
            step: state.time.STEP_TIME,
            NUM_REG: state.NUM_REG
        };
    },
    beforeRouteLeave(to, from, next) {
        if (this.$refs['end'].check() && this.$refs['step'].check()) {
            this.$store.commit('SET_END_TIME', this.end);
            this.$store.commit('SET_STEP_TIME', this.step);
            next();
        }
    },
    components: {
        'v-input': Input
    }
};
</script>

<style lang="stylus">
@import '../../css/Variable'

left = 35px

.slider-config section {
    margin 10px 20px
    color color-font

    h1 {
        font-size 25px
        line-height: 1.5;
        font-weight normal
        
        label {
            font-family font-serif
            position: absolute;
            color #888
        }
        span {
            margin-left left
            color color-black
        }
    }
    .form-line {
        display flex
        margin 15px 10px 15px left

        .input-grow {
            flex-grow 1
            margin-right 10px
        }
    }
}
</style>
