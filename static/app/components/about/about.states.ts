import { Ng1StateDeclaration } from '@uirouter/angularjs';

export const aboutState: Ng1StateDeclaration = {
    parent: 'app',
    name: 'about',
    url: '/about',
    component: 'about',
    data: {
        requiresAuth: true,
    },
};
