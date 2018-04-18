import { CreateElement } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

import PartsPanel from './parts';
import MainConfig from './config';

@Component({
    components: {
        PartsPanel,
        MainConfig,
    },
})
export default class SliderMenu extends Vue {
    showAddPartsTemp = false;
    showMainConfigTemp = false;

    $refs!: {
        // 'parts': PartsPanel;
        'config': MainConfig;
    };

    get showAddParts(): boolean {
        return this.$store.getters.showAddParts;
    }
    get showMainConfig(): boolean {
        return this.$store.getters.showMainConfig;
    }
    get vision(): boolean {
        return (this.showAddParts || this.showMainConfig);
    }

    close() {
        if (
            this.showAddParts ||
            (this.showMainConfig && this.$refs.config.check())
         ) {
            this.$store.commit('CLOSE_SLIDER');
        }
    }
    beforeEnter() {
        this.showAddPartsTemp = this.showAddParts;
        this.showMainConfigTemp = this.showMainConfig;
    }
    afterLeave() {
        this.showAddPartsTemp = false;
        this.showMainConfigTemp = false;
    }

    private render(h: CreateElement) {
        return (
            <transition
                name='move-slide'
                onBeforeEnter={this.beforeEnter}
                onAfterLeave={this.afterLeave}>
                <aside id='slider' v-show={this.vision}>
                    <parts-panel ref='parts' v-show={this.showAddPartsTemp}></parts-panel>
                    <main-config ref='config' v-show={this.showMainConfigTemp}></main-config>
                    <div
                        class='close-button'
                        v-show={this.showAddPartsTemp}
                        onClick={this.close}>
                        <span></span>
                    </div>
                    <div
                        v-show={this.showMainConfigTemp}
                        onClick={this.close}
                        class='gray-cover'>
                    </div>
                </aside>
            </transition>
        );
    }
}
