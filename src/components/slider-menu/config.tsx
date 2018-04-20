import { CreateElement } from 'vue';
import { TimeConfig } from 'src/vuex';
import { Component, Vue, Watch } from 'vue-property-decorator';

import InputVerifiable from 'src/components/input-verifiable';

@Component({
    components: {
        InputVerifiable,
    },
})
export default class MainConfig extends Vue {
    end = '';
    step = '';

    $refs!: {
        step: InputVerifiable;
        end: InputVerifiable;
    };

    private pattern = Number.SCIENTIFIC_COUNT_MATCH;

    private get storeTime(): TimeConfig {
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

    @Watch('storeTime', { immediate: true })
    private update() {
        this.end = this.storeTime.end;
        this.step = this.storeTime.step;
    }

    private render(h: CreateElement) {
        return <section class='time-config'>
            <header>
                <h1>模拟设置</h1>
                <h2>Simulation Settings</h2>
            </header>
            <article>
                <h1>
                    <label>T</label>
                    <span>时域模拟</span>
                </h1>
                <div class='form-item'>
                    <label>结束时间：</label>
                    <input-verifiable
                        ref='end'
                        value={this.end}
                        onInput={(val: string) => this.end = val}
                        rules={{ pattern: this.pattern }}>
                    </input-verifiable>
                    <span class='unit'>秒</span>
                </div>
                <div class='form-item'>
                    <label>固定步长：</label>
                    <input-verifiable
                        ref='step'
                        value={this.step}
                        onInput={(val: string) => this.step = val}
                        rules={{ pattern: this.pattern }}>
                    </input-verifiable>
                    <span class='unit'>秒</span>
                </div>
            </article>
        </section>;
    }
}
