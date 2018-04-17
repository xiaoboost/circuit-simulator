import { CreateElement } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

import Child from 'src/components/child-world';

@Component({
    components: {
        Child,
    },
})
export default class Hello extends Vue {
    text = '子组件';

    render(h: CreateElement) {
        return <div>
            <h4>This is rendered via TSX</h4>
            <child value={ this.text }></child>
        </div>;
    }
}
