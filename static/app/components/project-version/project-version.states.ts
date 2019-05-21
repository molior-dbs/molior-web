import { Ng1StateDeclaration, RedirectToResult, Transition, StateParams } from '@uirouter/angularjs';
import { BuildstateService } from '../buildstate/buildstate.service';
import { BuildvariantService } from '../buildvariant/buildvariant.service';
import { ProjectVersionService } from './project-version.service';
import { BuildService } from '../build/build.service';

const stateName = 'project-version';

/**
 * Resolves a projectversion by its id
 * @param ProjectVersionService Service to resolve project versions
 * @param $stateParams Query parameters
 * @param project Current project
 */
const versionResolver = (
    ProjectVersionService: ProjectVersionService,
    $stateParams: any,
    project: any,
) => ProjectVersionService.get($stateParams.versionId || project.versions[0].id);

/**
 * Resolves all available build variants
 * @param BuildvariantService Service to resolve buildvariants
 */
const allBuildvariantResolver = (
    BuildvariantService: BuildvariantService,
) => BuildvariantService.all();

export const projectDetailState: Ng1StateDeclaration = {
    parent: 'app',
    name: stateName,
    redirectTo: `${stateName}.info`,
    url: '/project/:projectId/:versionId',
    component: 'projectVersionDetail',
    data: {
        requiresAuth: true,
    },
    resolve: {
        project: (ProjectService, $stateParams) => ProjectService.get($stateParams.projectId),
        role: (UserRoleService, $stateParams) => UserRoleService.getProjectRoleByUser($stateParams.projectId, -1),
        user: (UserService) => UserService.get(-1),
        version: versionResolver,
    },
};

export const projectVersionInfo: Ng1StateDeclaration = {
    name: `${stateName}.info`,
    url: '/info',
    component: 'projectVersionInfo',
    data: {
        requiresAuth: true,
    },
    resolve: {
        version: versionResolver,
        buildvariants: (BuildvariantService: BuildvariantService, $stateParams, project) =>
            BuildvariantService.byProjectversion($stateParams.versionId || project.versions[0].id),
    },
};

export const projectVersionRepositoryState: Ng1StateDeclaration = {
    name: `${stateName}.repository`,
    abstract: true,
};

export const projectVersionRepositoryOverviewState: Ng1StateDeclaration = {
    name: `${stateName}.repository.overview`,
    url: '/repositories',
    component: 'repositoryOverview',
    data: {
        requiresAuth: true,
    },
    resolve: {
        page: ($stateParams) => $stateParams.page || 1,
        filters: ($stateParams) => ({
            name: $stateParams.name,
            url: $stateParams.url,
        }),
        buildvariants: allBuildvariantResolver,
    },
};

export const projectVersionRepositoryOverviewFilterState: Ng1StateDeclaration = {
    name: `${stateName}.repository.overview.filter`,
    url: '?page&name&url&openDialog',
};

export const projectVersionUserrolesState: Ng1StateDeclaration = {
    name: `${stateName}.userroles`,
    url: '/users',
    component: 'userRolesOverview',
    data: {
        requiresAuth: true,
    },
    resolve: {
        query: ($stateParams, Util) => {
            return {
                page: $stateParams.page || 1,
                pageSize: $stateParams.pageSize || 10,
                filter_name: $stateParams.filter_name,
                filter_role: $stateParams.filter_role,
            };
        },
    },
};

export const projectVersionUserrolesFilterState: Ng1StateDeclaration = {
    name: 'project-version.userroles.filter',
    url: '?page&pageSize&filter_name&filter_role',
};

export const buildState: Ng1StateDeclaration = {
    name: 'project-version.build',
    abstract: true,
};

export const buildOverviewState = {
    name: 'project-version.build.overview',
    url: '/builds',
    component: 'buildOverview',
    data: {
        requiresAuth: true,
    },
    resolve: {
        filters: ($stateParams) => {
            return {
                sourcerepository: $stateParams.sourcrepository,
                version: $stateParams.version,
                architecture: $stateParams.architecture,
                maintainer: $stateParams.maintainer,
                startstamp: $stateParams.startstamp,
                buildstate: $stateParams.buildstate,
                buildvariant: $stateParams.buildvariant,
            };
        },
        page: ($stateParams) => $stateParams.page,
        from: ($stateParams) => $stateParams.fromcurrentlyFailing,
        projectVersionId: ($stateParams) => $stateParams.versionId,
        projectId: ($stateParams) => $stateParams.projectId,
        currentlyFailing: ($stateParams) => $stateParams.currentlyFailing,
        buildstates: (BuildstateService: BuildstateService) => BuildstateService.all(),
    },
};

export const buildOverviewFilterState = {
    name: 'project-version.build.overview.filter',
    url: '?sourcrepository&version&architecture&maintainer&startstamp&buildstate&page&from&currentlyFailing&buildvariant',
};

export const buildDetailState: Ng1StateDeclaration = {
    name: `project-version.build.detail`,
    url: '/build/:buildId',
    component: 'buildDetail',
    data: {
        requiresAuth: true,
    },
    resolve: {
        build: (
            BuildService: BuildService,
            $stateParams: StateParams,
        ) => BuildService.byId($stateParams.buildId),
    },
};

export const buildDetailLoglineState = {
    name: `project-version.build.detail.logline`,
    url: '/:logline',
    resolve: {
        logline: ($stateParams) => $stateParams.logline,
    },
};
