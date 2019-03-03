import Vue from 'vue';

// css
import 'ant-design-vue/es/style/index.css';
import 'ant-design-vue/es/grid/style/index.css';
import 'ant-design-vue/es/input/style/index.css';
import 'ant-design-vue/es/select/style/index.css';
import 'ant-design-vue/es/popover/style/index.css';
import 'ant-design-vue/es/tooltip/style/index.css';
import 'ant-design-vue/es/button/style/index.css';
import 'ant-design-vue/es/input-number/style/index.css';

// component
import {
    Row,
    Col,
    Input,
    Popover,
    Tooltip,
    Select,
    Button,
    InputNumber,
} from 'ant-design-vue';

Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Select);
Vue.use(Button);
Vue.use(InputNumber);

// directive
import Decorator from 'ant-design-vue/es/_util/FormDecoratorDirective';

Vue.use(Decorator);
