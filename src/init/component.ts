import Vue from 'vue';

// css
import 'ant-design-vue/es/style/index.css';
import 'ant-design-vue/es/form/style/index.css';
import 'ant-design-vue/es/grid/style/index.css';
import 'ant-design-vue/es/input/style/index.css';
import 'ant-design-vue/es/select/style/index.css';
import 'ant-design-vue/es/popover/style/index.css';
import 'ant-design-vue/es/tooltip/style/index.css';

// component
import {
    Row,
    Col,
    Form,
    Input,
    Popover,
    Tooltip,
    Select,
} from 'ant-design-vue';

// directive
import Decorator from 'ant-design-vue/es/_util/FormDecoratorDirective';

Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(Input);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Decorator);
Vue.use(Select);

Vue.prototype.$form = Form;
