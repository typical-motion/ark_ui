import { createApp } from 'vue'
import App from './App.vue'

import Rosws from './rosws'

import Antd from 'ant-design-vue';
import './assets/index.css'

import { router } from './router'

import { TroisJSVuePlugin } from 'troisjs';

import Panel from './panel/Panel.vue'

import * as echarts from 'echarts';

const app = createApp(App)

app.config.productionTip = false;
app.config.devtools = true;
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app

app.component('panel', Panel)

app.use(Antd);
app.use(Rosws);

app.use(router)
app.use(TroisJSVuePlugin);

app.config.globalProperties.$echarts = echarts;

app.mount('#app')

