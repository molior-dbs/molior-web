import { Ng1StateDeclaration } from '@uirouter/angularjs';
import { projectState } from './components/project/project.states';
import { AppService } from './app.service';

export const rootState: Ng1StateDeclaration = {
    name: 'root',
    url: '/',
    redirectTo: projectState.name,
};

/**
 * An abstract parent state with footer and header
 */
export const appState: Ng1StateDeclaration = {
    name: 'app',
    component: 'app',
    resolve: {
        status: (AppService: AppService) => AppService.status(),
    },
};
