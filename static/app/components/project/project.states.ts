import { Ng1StateDeclaration, StateParams } from '@uirouter/angularjs';
import { ProjectService } from './project.service';
import { PaginationQuery } from '@molior/core';
import { ProjectDetail } from './interfaces';

/**
 * An overview of all projects
 * filtered by the query parameters
 */
export const projectState: Ng1StateDeclaration = {
    parent: 'app',
    name: 'project',
    url: '/project',
    redirectTo: 'project.list',
    component: 'projectOverview',
    data: {
        requiresAuth: true,
    },
    resolve: {
        query: ($stateParams: StateParams) => ({ q: $stateParams.q }),
    },
};

export const projectStateList: Ng1StateDeclaration = {
    url: '?q',
    name: 'project.list',
    component: 'projectOverviewList',
    params: {
        q: null,
    },
    resolve: {
        projects: async (
            ProjectService: ProjectService,
            query: { q: string },
        ) => (await ProjectService.all({ q: query.q })).results,
    },
};

export const projectDetailState: Ng1StateDeclaration = {
    // Add molior header and footer
    parent: 'app',
    name: 'project-detail',
    url: '/project/:projectId',
    component: 'projectDetail',
    data: {
        requiresAuth: true,
    },
    resolve: {
        project: (
            $stateParams: StateParams,
            ProjectService: ProjectService,
        ): Promise<ProjectDetail> => ProjectService.get($stateParams.projectId),
    },
};
