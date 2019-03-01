import { State } from 'vuex-class';
import { Component, Watch, Vue } from 'vue-property-decorator';
import { MutationName as Mutation, TimeConfig } from 'src/vuex';

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
    time!: TimeConfig;

    @Watch('time', { immediate: true })
    private update() {
        this.end = this.time.end;
        this.step = this.time.step;
    }

    check() {
        if (!this.$refs.end.validate() || !this.$refs.step.validate()) {
            return false;
        }

        if (
            this.end !== this.time.end ||
            this.step !== this.time.step
        ) {
            this.$store.commit(Mutation.SET_TIME_CONFIG, {
                step: this.step,
                end: this.end,
            });
        }

        return true;
    }
}
