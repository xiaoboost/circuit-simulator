import { State } from 'vuex-class';
import { TimeConfig } from 'src/vuex';
import { Component, Watch, Vue } from 'vue-property-decorator';

import InputVerifiable from 'src/components/input-verifiable/component';

@Component({
    components: {
        InputVerifiable,
    },
})
export default class ConfigPanel extends Vue {
    end = '';
    step = '';

    // 验证输入格式的正则
    private pattern = Number.SCIENTIFIC_COUNT_MATCH;

    $refs!: {
        step: InputVerifiable;
        end: InputVerifiable;
    };

    @State('time')
    storeTime!: TimeConfig;

    @Watch('storeTime', { immediate: true })
    private update() {
        this.end = this.storeTime.end;
        this.step = this.storeTime.step;
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
}
