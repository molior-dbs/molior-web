import { GettingStartedService } from './getting-started.service';

export const gettingStartedState = {
    name: 'getting-started',
    parent: 'app',
    url: '/getting-started',
    component: 'gettingStarted',
    resolve: {
        gettingStarted: (GettingStartedService: GettingStartedService) => GettingStartedService.all(),
    },
};
