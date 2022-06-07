import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const blockchain: AppRouteModule = {
  path: '/blockchain',
  name: 'blockchain',
  component: LAYOUT,
  redirect: '/blockchain/token',
  meta: {
    orderNo: 11,
    icon: 'ion:grid-outline',
    title: '区块链',
  },
  children: [
    // {
    //   path: 'token',
    //   name: 'token',
    //   component: () => import('/@/views/blockchain/token/index.vue'),
    //   meta: {
    //     // affix: true,
    //     title: '代币',
    //   },
    // },
    {
      path: 'erc20',
      name: 'erc20',
      component: () => import('../../../views/blockchain/token/erc20.vue'),
      meta: {
        // affix: true,
        title: 'ERC20代币',
      },
    },
    {
      path: 'manage/:contractAddr',
      name: 'manage',
      component: () => import('/@/views/blockchain/token/manage.vue'),
      meta: {
        title: 'ERC20代币管理',
        // carryParam: true,
      },
    },
    {
      path: 'service-receiver',
      name: 'serviceReceiver',
      component: () => import('/@/views/blockchain/service/ServiceReceiver.vue'),
      meta: {
        title: 'ERC20代币服务',
      },
    },
  ],
};

export default blockchain;
