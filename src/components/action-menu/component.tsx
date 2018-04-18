import './component.styl';

import { CreateElement } from 'vue';
import { action, Icon } from './icons';
import { Component, Vue } from 'vue-property-decorator';

const zoom = 0.6;

const icons = [
    { name: 'run', tip: '' },
    { name: 'add', tip: '添加器件' },
    { name: 'config', tip: '运行设置' },
].map((data) => {
    const icon = action[data.name] as Icon;

    return {
        ...data,
        ...icon,
        translate: icon.transform.map((n) => n + (1 - zoom) / 2 * icon.long).join(','),
    };
});

@Component
export default class ActionMenu extends Vue {
    /** 图标缩放比例 */
    readonly zoom = zoom;
    /** 图标数据 */
    readonly icons = icons;

    /** 当前是否正在运行 */
    private isRun = false;

    /** 是否显示菜单 */
    get vision(): boolean {
        // return this.$store.getters.isSpace;
        return true;
    }

    /** 按钮被点击 */
    private action(name: string): void {
        const funcs = {
            run: () => this.isRun = true,
            add: () => this.$store.commit('OPEN_ADD_PARTS'),
            config: () => this.$store.commit('OPEN_MAIN_CONFIG'),
        };

        funcs[name]();
    }

    private render(h: CreateElement) {
        return <transition name='fade'>
            <footer class='action-menu' v-show={this.vision}>
                {this.isRun
                    ? <div class='fab-container'>
                        <div class='fab' id='fab-text'></div>
                    </div> : ''}
                {this.icons.map((icon, i) =>
                    <div
                        class='fab-container'
                        v-show={!this.isRun} key={i}
                        onClick={() => this.action(icon.name)}>
                        {icon.tip ? <span class='fab-tip'>{icon.tip}</span> : ''}
                        <div class='fab'>
                            <svg viewBox={`0 0 ${icon.long} ${icon.long}`}>
                                <g transform={`translate(${icon.translate}) scale(${zoom}, ${zoom})`}>
                                    <path d={icon.d}></path>
                                </g>
                            </svg>
                        </div>
                    </div>,
                )}
            </footer>
        </transition>;
    }
}
