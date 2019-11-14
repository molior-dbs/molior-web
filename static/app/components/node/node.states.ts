import { Ng1StateDeclaration, StateParams } from '@uirouter/angularjs';

//  export const nodeListState: Ng1StateDeclaration = {
//      name: 'nodes',
//      parent: 'app',
//      url: '/nodes?q&page&page_size',
//      component: 'nodeOverview',
//      data: {
//          requiresAuth: true,
//      },
//      params: {
//          q: {
//              value: '',
//              squash: true,
//          },
//          page_size: {
//              value: '10',
//              squash: true,
//          },
//          page: {
//              value: '1',
//              squash: true,
//          },
//      },
//      resolve: {
//          query: ($stateParams: StateParams) => ({
//              q: $stateParams.q,
//              page_size: $stateParams.page_size || 10,
//              page: $stateParams.page || 1,
//          }),
//      },
//  };

export const nodeOverviewState: Ng1StateDeclaration = {
    parent: 'app',
    name: 'nodes',
    url: '/nodes',
    component: 'nodeOverview',
    data: {
        requiresAuth: true,
    },
// loops    params: {
//         q: {
//             value: '',
//             squash: true,
//         },
//         page_size: {
//             value: '10',
//             squash: true,
//         },
//         page: {
//             value: '1',
//             squash: true,
//         },
//     },
    resolve: {
        query: ($stateParams: StateParams) => ({
            page_size: $stateParams.page_size || 10,
            page: $stateParams.page || 1,
            q: $stateParams.q,
        }),
    },
};

export const nodeOverviewListState: Ng1StateDeclaration = {
    name: 'nodes.list',
    url: '?q&page&page_size',
};

//export const nodeOverviewState: Ng1StateDeclaration = {
//    parent: 'app',
//    name: 'nodes',
//    url: '/nodes',
//    redirectTo: 'nodes.list',
//    component: 'nodeOverview',
//};
//
//export const nodeListState: Ng1StateDeclaration = {
//    name: 'nodes.list',
//    url: '?q&page&page_size',
//    component: 'nodeList',
//    data: {
//        requiresAuth: true,
//    },
//    params: {
//        q: {
//            value: '',
//            squash: true,
//        },
//        page_size: {
//            value: '10',
//            squash: true,
//        },
//        page: {
//            value: '1',
//            squash: true,
//        },
//    },
//    resolve: {
//        query: ($stateParams: StateParams) => ({
//            q: $stateParams.q,
//            page_size: $stateParams.page_size || 10,
//            page: $stateParams.page || 1,
//        }),
//    },
//};
