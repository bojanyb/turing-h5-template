import { RouteRecordRaw } from 'vue-router';

const redirectRouter: RouteRecordRaw[] = [
  {
    path: '/transferPage',
    name: 'transferPage',
    component: () => import('/@/views/withdrawal/components/transferPage.vue'),
    meta: {
      title: '签署协议',
    },
  },
  {
    path: '/authorization',
    name: 'authorization',
    component: () => import('/@/views/withdrawal/components/authorization.vue'),
    meta: {
      title: '支付宝授权',
    },
  },
];

export default redirectRouter;
