import * as angular from 'angular';

import { AddRepositoryHookComponent } from './add-repository-hook.component';
import { RepositoryDetailComponent } from './repository-detail.component';
import { RepositoryDetailInformationComponent } from './repository-detail-information.component';
import { RepositoryDetailStatsComponent } from './repository-detail-stats.component';
import * as  stateConfig from './repository-detail.states';
import { registerStates } from '@molior/app.util';

/**
 * Module for the repository detail
 */
export const RepositoryDetailModule = angular
    .module('moliorApp.components.repository.detail', [])
    .component('repositoryDetail', RepositoryDetailComponent)
    .component('repositoryDetailInformation', RepositoryDetailInformationComponent)
    .component('repositoryDetailStats', RepositoryDetailStatsComponent)
    .component('addRepositoryHook', AddRepositoryHookComponent)
    .config(registerStates(stateConfig))
    .name;
