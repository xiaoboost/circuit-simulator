import { Getter } from 'vuex-class';
import { MutationName } from 'src/vuex';
import { Component, Vue } from 'vue-property-decorator';

import PartsPanel from './parts-panel';
import ConfigPanel from './config-panel/component';

@Component({
    components: {
        PartsPanel,
        ConfigPanel,
    },
})
export default class SliderMenu extends Vue {
    partsPanelDelay = false;
    configPanelDelay = false;

    $refs!: {
        'parts': PartsPanel;
        'config': ConfigPanel;
    };

    @Getter
    showPartsPanel!: boolean;

    @Getter
    showConfigPanel!: boolean;

    get vision() {
        return this.showPartsPanel || this.showConfigPanel;
    }

    close() {
        if (
            this.showPartsPanel ||
            (this.showConfigPanel && this.$refs.config.check())
         ) {
            this.$store.commit(MutationName.CLOSE_SLIDER);
        }
    }
    beforeEnter() {
        this.partsPanelDelay = this.showPartsPanel;
        this.configPanelDelay = this.showConfigPanel;
    }
    afterLeave() {
        this.partsPanelDelay = false;
        this.configPanelDelay = false;
    }
}
