import { Ng1StateDeclaration } from '@uirouter/angularjs';
import { MoliorStatusService } from './molior-status.service';

export const projectVersionState: Ng1StateDeclaration = {
    name: 'status',
    parent: 'app',
    url: '/status',
    component: 'moliorStatus',
    data: {
        requiresAuth: true,
    },
    resolve: {
        status: (MoliorStatus: MoliorStatusService) => MoliorStatus.all(),
    },
};
