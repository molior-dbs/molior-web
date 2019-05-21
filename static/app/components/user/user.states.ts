import { Ng1StateDeclaration, StateParams } from '@uirouter/angularjs';

export const userOverviewState: Ng1StateDeclaration = {
    parent: 'app',
    name: 'users',
    url: '/users',
    redirectTo: 'users.list',
    component: 'userOverview',
};

export const userListState: Ng1StateDeclaration = {
    name: 'users.list',
    url: '?q&filter_admin&page&page_size',
    component: 'userList',
    data: {
        requiresAuth: true,
    },
    params: {
        filter_admin: {
            value: 'false',
            squash: true,
        },
        q: {
            value: '',
            squash: true,
        },
        page_size: {
            value: '10',
            squash: true,
        },
        page: {
            value: '1',
            squash: true,
        },
    },
    resolve: {
        query: ($stateParams: StateParams) => ({
            filter_admin: $stateParams.filter_admin,
            q: $stateParams.q,
            page_size: $stateParams.page_size || 10,
            page: $stateParams.page || 1,
        }),
    },
};
