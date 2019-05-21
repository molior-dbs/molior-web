import { BuildstateService } from '../buildstate/buildstate.service';
import { Ng1StateDeclaration, StateParams } from '@uirouter/angularjs';
import { BuildService } from './build.service';

const stateName = 'build';

export const buildState: Ng1StateDeclaration = {
    name: stateName,
    parent: 'app',
    abstract: true,
};

export const buildDetailState: Ng1StateDeclaration = {
    name: `${stateName}.detail`,
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
    name: `${stateName}.detail.logline`,
    url: '/:logline',
    resolve: {
        logline: ($stateParams) => $stateParams.logline,
    },
};

export const buildOverviewState: Ng1StateDeclaration = {
    name: 'build.overview',
    url: '/builds?sourcrepository&version&architecture&maintainer&startstamp&buildstate&page&from&currentlyFailing&buildvariant',
    component: 'buildLayout',
    data: {
        requiresAuth: true,
    },
    params: {
        page: {
            squash: true,
            value: '1',
        },
    },
    resolve: {
        filters: ($stateParams) => ({
            sourcerepository: $stateParams.sourcrepository,
            version: $stateParams.version,
            architecture: $stateParams.architecture,
            maintainer: $stateParams.maintainer,
            startstamp: $stateParams.startstamp,
            buildstate: $stateParams.buildstate,
            buildvariant: $stateParams.buildvariant,
        }),
        page: ($stateParams) => $stateParams.page,
        from: ($stateParams) => $stateParams.fromcurrentlyFailing,
        currentlyFailing: ($stateParams) => $stateParams.currentlyFailing,
        buildstates: (BuildstateService: BuildstateService) => BuildstateService.all(),
    },
};
