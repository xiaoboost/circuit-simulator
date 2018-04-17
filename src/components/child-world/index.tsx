import { CreateElement } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ComponentInterface } from './types';

import css from './style.styl';

@Component
export default class Child extends Vue implements ComponentInterface {
    @Prop({ type: String, default: '子组件' })
    value!: string;

    render(h: CreateElement) {
        return <div>
            <p class={ css.title }>This is child component.</p>
            <p>This is prop value: { this.value }.</p>
        </div>;
    }
}
