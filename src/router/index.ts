import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { staticRouter } from '/@/router/modules/staticRouter';
import { useUserStore } from '/@/store/modules/user';

const mode = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory(),
};

//导入生成的路由数据
const router = createRouter({
  history: routerMode[mode](),
  routes: [...staticRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * @description 路由拦截 beforeEach
 * */

router.beforeEach((_to, _from, next) => {
  // 动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE;
  document.title = _to.meta.title ? `${_to.meta.title} - ${title}` : title;

  // token参数获取
  const token = _to.query.token;
  if (token) {
    console.log('[ url上获取的token ] >', token);
    useUserStore().setToken(token as string);
  }

  // 正常访问页面
  // 检查目标 URL 是否以 `//` 开头
  if (_to.path.startsWith('//')) {
    // 如果是，修正目标 URL
    const path = _to.path.substring(1);
    next({ path, query: _to.query });
  } else {
    // 如果不是，继续导航
    next();
  }
});

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  console.warn('路由错误', error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {});

export default router;
