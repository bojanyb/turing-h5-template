import { RouteRecordRaw } from 'vue-router';

const WithdrawalRoutes: RouteRecordRaw[] = [
  {
    path: '/withdrawal',
    name: 'withdrawal',
    component: () => import('/@/views/withdrawal/index.vue'),
    redirect: '/withdrawal/home',
    meta: {
      title: '提现',
    },
    children: [
      {
        path: 'home',
        name: 'withdrawal-home',
        component: () => import('/@/views/withdrawal/home.vue'),
        meta: {
          title: '提现首页',
        },
      },
      {
        path: 'apply',
        name: 'withdrawal-apply',
        component: () => import('/@/views/withdrawal/apply.vue'),
        meta: {
          title: '提现申请',
        },
      },
      {
        path: 'list',
        name: 'withdrawal-list',
        component: () => import('/@/views/withdrawal/list.vue'),
        meta: {
          title: '提现列表',
        },
      },
    ],
  },
];

export default WithdrawalRoutes;
