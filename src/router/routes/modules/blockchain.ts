import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const blockchain: AppRouteModule = {
  path: '/contracts',
  name: 'contracts',
  component: LAYOUT,
  redirect: '/contracts/token',
  meta: {
    orderNo: 11,
    icon: 'ion:grid-outline',
    title: '智能合约',
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
      path: 'erc20/manage/:contractAddr',
      name: 'erc20Manage',
      component: () => import('/@/views/blockchain/token/manage.vue'),
      meta: {
        title: 'ERC20代币管理',
        hideMenu: true,
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
