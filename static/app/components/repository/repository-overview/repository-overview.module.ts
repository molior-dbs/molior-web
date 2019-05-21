import * as angular from 'angular';

import { RepositoryItemDirective } from './repository-item.directive';
import { RepositoryOverviewComponent } from './repository-overview.component';

/**
 * @ngdoc overview
 * @name moliorApp.components.repository.overview
 * @description
 * # moliorApp.components.repository.overview
 * This module is here for repository operations.
 *
 */
export const RepositoryOverviewModule = angular
    .module('moliorApp.components.repository.overview', [])
    .directive('repositoryItem', RepositoryItemDirective)
    .component('repositoryOverview', RepositoryOverviewComponent)
    .name;
