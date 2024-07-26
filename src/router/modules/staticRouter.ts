import { RouteRecordRaw } from 'vue-router';
import { HOME_URL } from '/@/config';
import WithdrawalRoutes from './withdrawalRoutes';
import redirectRoutes from './redirectRoutes';

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: HOME_URL,
    component: () => import('/@/layouts/index.vue'),
    children: [
      {
        path: '/home/index',
        name: 'home',
        component: () => import('/@/views/home/index.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: '/vap-animate',
        name: 'vapAnimate',
        component: () => import('/@/views/vap-animate/index.vue'),
        meta: {
          title: 'vap动效',
        },
      },
      {
        path: '/couple',
        name: 'couple',
        component: () => import('/@/views/couple/index.vue'),
        meta: {
          title: '拍拍关系',
        },
      },
      {
        path: '/guild',
        name: 'guildApply',
        component: () => import('/@/views/guild-apply/index.vue'),
        meta: {
          title: '公会申请',
        },
      },
      {
        path: '/nobility',
        name: 'nobilityExplain',
        component: () => import('/@/views/nobility-explain/index.vue'),
        meta: {
          title: '贵族说明',
        },
      },
      {
        path: '/invite',
        name: 'invite',
        component: () => import('/@/views/invite/index.vue'),
        meta: {
          title: '推荐人',
        },
      },
      {
        path: '/agreement',
        name: 'agreement',
        component: () => import('/@/views/agreement/index.vue'),
        meta: {
          title: '协议',
        },
      },
      {
        path: '/jurisdiction',
        name: 'jurisdiction',
        component: () => import('/@/views/system/jurisdiction/index.vue'),
        meta: {
          title: '系统权限使用清单',
        },
      },
      {
        path: '/thirdparty',
        name: 'thirdParty',
        component: () => import('/@/views/system/third-party/index.vue'),
        meta: {
          title: '第三方信息数据共享',
        },
      },
      {
        path: '/peach-blossom-luck',
        name: 'peachBlossomLuck',
        component: () => import('/@/views/peach-blossom-luck/index.vue'),
        meta: {
          title: '桃花运',
        },
      },
      {
        path: '/static-banner',
        name: 'staticBanner',
        component: () => import('/@/views/static-banner/index.vue'),
        meta: {
          title: '宣传横幅',
        },
      },
      {
        path: '/love-explain',
        name: 'loveExplain',
        component: () => import('/@/views/love-explain/index.vue'),
        meta: {
          title: '真爱说明',
        },
      },
      {
        path: '/marry-guide',
        name: 'marryGuide',
        component: () => import('/@/views/marry-guide/index.vue'),
        meta: {
          title: '控场指南',
        },
      },
      {
        path: '/music-companion',
        name: 'musicCompanion',
        component: () => import('/@/views/music-companion/index.vue'),
        meta: {
          title: 'turing-h5-template陪伴官',
        },
      },
      {
        path: '/game',
        name: 'game',
        component: () => import('/@/views/game/index.vue'),
        meta: {
          title: '游戏',
        },
      },
      {
        path: '/game/:id',
        name: 'GameDetail',
        component: () => import('/@/views/game/detail/index.vue'),
        meta: {
          title: '游戏',
        },
      },
      {
        path: '/become-god',
        name: 'becomeGod',
        component: () => import('/@/views/become-god/index.vue'),
        meta: {
          title: '进阶大神',
        },
      },
      {
        path: '/jump-sign-protocol',
        name: 'jumpSignProtocol',
        component: () => import('/@/views/jump-sign-protocol/index.vue'),
        meta: {
          title: '跳转签署协议',
        },
      },
      ...WithdrawalRoutes,
      ...redirectRoutes,
    ],
  },
];

// /**
//  * errorRouter (错误页面路由)
//  */
// export const errorRouter = [
//   {
//     path: '/403',
//     name: '403',
//     component: () => import('@/components/ErrorMessage/403.vue'),
//     meta: {
//       title: '403页面',
//     },
//   },
//   {
//     path: '/404',
//     name: '404',
//     component: () => import('@/components/ErrorMessage/404.vue'),
//     meta: {
//       title: '404页面',
//     },
//   },
//   {
//     path: '/500',
//     name: '500',
//     component: () => import('@/components/ErrorMessage/500.vue'),
//     meta: {
//       title: '500页面',
//     },
//   },
//   // Resolve refresh page, route warnings
//   {
//     path: '/:pathMatch(.*)*',
//     component: () => import('@/components/ErrorMessage/404.vue'),
//   },
// ];
