import { Getter } from 'vuex-class';
import { MutationName, Getter as GetterTree } from 'src/vuex';
import { Component, Vue } from 'vue-property-decorator';

import PartsPanel from '../parts-panel';
import ConfigPanel from '../config-panel';

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
    showPartsPanel!: GetterTree['showPartsPanel'];

    @Getter
    showConfigPanel!: GetterTree['showConfigPanel'];

    get vision() {
        return this.showPartsPanel || this.showConfigPanel;
    }

    close() {
        if (
            this.showPartsPanel ||
            (this.showConfigPanel && this.$refs.config.validate())
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
