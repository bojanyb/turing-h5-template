import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import piniaStore from './store';

import 'vant/lib/index.css';
import '/@/styles/index.scss';
import '/@/styles/reset.scss';
import 'uno.css';
import Vconsole from 'vconsole';

// 支持SVG
import 'virtual:svg-icons-register';

// 是否开启Vconsole
if (JSON.parse(import.meta.env.VITE_USE_VCONSOLE as unknown as string)) {
  new Vconsole();
}

//vue3的挂载方式
const app = createApp(App);

app.use(router);
app.use(piniaStore);
app.mount('#app');
