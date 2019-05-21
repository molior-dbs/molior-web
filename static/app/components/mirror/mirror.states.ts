import { Ng1StateDeclaration, StateParams } from '@uirouter/angularjs';
import { UserService } from '../user/user.service';

export const mirrorOverviewState: Ng1StateDeclaration = {
    parent: 'app',
    name: 'mirrors',
    url: '/mirrors',
    component: 'mirrorOverview',
    data: {
        requiresAuth: true,
    },
    resolve: {
        user: (UserService: UserService) => UserService.get(-1),
        query: ($stateParams: StateParams) => ({
            pageSize: $stateParams.pageSize || 10,
            page: $stateParams.page || 1,
            filter_name: $stateParams.filter_name,
        }),
    },
};

export const mirrorOverviewFilterState: Ng1StateDeclaration = {
    name: 'mirrors.filter',
    url: '?filter_name&page&pageSize',
};
