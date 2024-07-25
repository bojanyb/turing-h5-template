# voice-web 项目文档

## 启动项目

```javascript
// 拉取项目
git clone git@e.coding.net:aiyilive/miaomiaostar/voice-web.git

// 安装依赖
yarn install  or  pnpm install(不推荐使用npm)

// 启动项目
yarn dev  or  pnpm dev
```

## vite.config.ts 基础配置

如果你的 `Vue Router` 模式是 hash

```javascript
publicPath: './',
```

如果你的 `Vue Router` 模式是 history 这里的 publicPath 和你的 `Vue Router` `base` **保持一致**

```javascript
publicPath: '/app/',
```

```javascript
import { UserConfig, ConfigEnv } from 'vite';
import { createVitePlugins } from './build/vite/plugins';
import { resolve } from 'path';
import proxy from './build/vite/proxy';
import { VITE_PORT } from './build/constant';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  let base: string;
  if (command === 'build') {
    base = '/fast-vue3/';
  } else {
    base = '/';
  }
  return {
    base,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    // plugins
    plugins: createVitePlugins(isBuild),

    // css
    css: {},

    // server
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      // 服务配置
      port: VITE_PORT, // 类型： number 指定服务器端口;
      open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: false, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0', // IP配置，支持从IP启动
      proxy,
    },
  };
};
```

## Vite 插件集成

基于原生 ES 模块提供了丰富的内建功能，如速度快到惊人的模块热更新（HMR），使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。更多关于[vite](https://cn.vitejs.dev/guide/)

模版集成了如下的 vite 插件

- unplugin-auto-import（按需加载，自动引入）
- unplugin-vue-components（按需加载，自动引入组件）
- vite-plugin-compression（开启.gz 压缩）
- vite-plugin-imagemin（图片压缩）
- vite-plugin-mock（引入 mockjs，本地模拟接口）
- vite-plugin-pages（动态生成路由）
- vite-plugin-progress（构建显示进度条）
- vite-plugin-restart（监听配置文件修改自动重启 Vite）
- vite-plugin-svg-icons（加载 SVG 文件，自动引入）
- rollup-plugin-visualizer（打包分析）

## 多环境变量

`package.json` 里的 `scripts` 配置 `dev` `dev:test` `dev:prod` ，通过 `--mode xxx` 来执行不同环境

- 通过 `yarn dev` 启动本地环境参数 , 执行 `development`
- 通过 `yarn dev:test` 启动测试环境参数 , 执行 `test`
- 通过 `yarn dev:prod` 启动正式环境参数 , 执行 `prod`

```javascript
"scripts": {
    "dev": "vite",
    "dev:test": "vite --mode test",
    "dev:prod": "vite --mode production",
}
```

## 多 UI 组件库供选择

Vite 构建工具，使用 vite-plugin-style-import 和 unplugin-vue-components/vite 实现按需引入。

### 安装插件

```javascript
yarn add vite-plugin-style-import -D
yarn add unplugin-vue-components/vite -D
```

### 使用组件库

在`build/vite/plugins/component.ts`下

```javascript
import { ElementPlusResolver, VueUseComponentsResolver, AntDesignVueResolver,TDesignResolver,NaiveUiResolver } from 'unplugin-vue-components/resolvers';
...
resolvers: [
  ElementPlusResolver(),
  VueUseComponentsResolver(),
  AntDesignVueResolver(),
  TDesignResolver(),
  NaiveUiResolver()
]
...
```

### 不需要某个组件库

1. 删除不需要的组件
2. remove 不想要的组件的包依赖
3. 删除`build/vite/plugin/component`下对应的`resolvers`

## Pinia 状态管理

下一代 vuex，使用极其方便，ts 兼容好

目录结构

```bash
├── store
│   ├── modules
│   │   └── user.js
│   ├── index.js
```

目前 pinia 分为两种编程模式,options API 和 Composition API，我们这边都会列举出来实现的业务逻辑效果是一样的，提供大家思路

### options API

```javascript
interface StoreUser {
  token: string;
  info: Record<any, any>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): StoreUser => ({
    token: token,
    info: {},
  }),
  getters: {
    getUserInfo(): any {
      return this.info || {};
    },
  },
  actions: {
    setInfo(info: any) {
      this.info = info ? info : '';
    },
    login() {
      return new Promise((resolve) => {
        const { data } = loginPassword();
        watch(data, () => {
          this.setInfo(data.value);
          // useCookies().set(VITE_TOKEN_KEY as string, data.value.token);
          resolve(data.value);
        });
      });
    },
  },
});
```

### Composition API:

```javascript
export const useUserStore = defineStore('app-user', () => {
  const Token = ref(token);
  const info = ref<Record<any, any>>({});
  const setInfo = (info: any) => {
    info.value = info ? info : '';
  };
  const getUserInfo = () => {
    return info || {};
  };
  const login = () => {
    return new Promise((resolve) => {
      const { data } = loginPassword();
      watch(data, () => {
        setInfo(data.value);
        // useCookies().set(VITE_TOKEN_KEY as string, data.value.token);
        resolve(data.value);
      });
    });
  };
  return {
    Token,
    info,
    setInfo,
    login,
    getUserInfo,
  };
})
```

使用

```javascript
<script lang="ts" setup>
  import {useUserStore} from "@/store/modules/user"; const userStore = useUserStore(); userStore.login();
</script>
```

## vue-router

开发者根据需求修改 `mode` `base`

**注意**：如果你使用了 `history` 模式， `vue.config.js` 中的 `publicPath` 要做对应的**修改**

```javascript
import Vue from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';

Vue.use(Router);
export const routes = [
  {
    name: 'root',
    path: '/',
    redirect: '/home',
    component: () => import('@/layout/basic/index.vue'),
  },
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
```

## axios 封装及接口管理

`utils/request.js` 封装 axios , 开发者需要根据后台接口做修改。

- `service.interceptors.request.use` 里可以设置请求头，比如设置 `token`
- `config.hideloading` 是在 api 文件夹下的接口参数里设置，下文会讲
- `service.interceptors.response.use` 里可以对接口返回数据处理，比如 401 删除本地信息，重新登录

```javascript
import axios from "axios";
import store from "@/store";
import { showToast，closeToast } from 'vant';
// 根据环境不同引入不同api地址
import { baseApi } from "@/config";

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request 拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    }
    if (store.getters.token) {
      config.headers["X-Token"] = "";
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// respone拦截器
service.interceptors.response.use(
  (response) => {
    Toast.clear();
    const res = response.data;
    if (res.status && res.status !== 200) {
      // 登录超时,重新登录
      if (res.status === 401) {
        store.dispatch("FedLogOut").then(() => {
          location.reload();
        });
      }
      return Promise.reject(res || "error");
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    closeToast();
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);
export default service;
```

## alias

```javascript
resolve: {
    alias: [{
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
            find: /\/@\//,
            replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
            find: /\/#\//,
            replacement: pathResolve('types') + '/',
        },
    ],
},
```

## proxy 跨域

```javascript
server: {
    proxy: {
        '/api': {
            target: 'https://baidu.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    }
},
```

## Eslint+Pettier+stylelint 统一开发规范

根目录下的.eslintrc.js、.stylelint.config.js、.prettier.config.js 内置了 lint 规则，帮助你规范地开发代码，有助于提高团队的代码质量和协作性，可以根据团队的规则进行修改
