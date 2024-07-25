import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import { createVitePlugins } from './build/vite/plugins';
import { resolve } from 'path';
import proxy from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createHtmlPlugin } from 'vite-plugin-html';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build';
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  console.log(viteEnv);

  return {
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
        // @/xxxx => src/xxxx
        {
          find: /@\//,
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
    plugins: [
      createVitePlugins(viteEnv, isBuild),
      createHtmlPlugin({
        inject: {
          data: {
            title: process.env.VITE_GLOB_APP_TITLE,
          },
        },
      }),
    ],

    // css
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "/@/styles/var.scss";`,
        },
      },
    },

    // server
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      // 服务配置
      port: viteEnv.VITE_PORT, // 类型： number 指定服务器端口;
      open: viteEnv.VITE_OPEN, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0', // IP配置，支持从IP启动
      proxy,
    },
  };
};
