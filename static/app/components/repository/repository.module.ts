import * as angular from 'angular';

import { RepositoryDetailModule } from './repository-detail/repository-detail.module';
import { RepositoryFormModule } from './repository-form/repository-form.module';
import { RepositoryOverviewModule } from './repository-overview/repository-overview.module';
import { RepositoryService } from './repository.service';


/**
 * This module is here for repository operations.
 */
export const RepositoryModule = angular
    .module('moliorApp.components.repository', [
        RepositoryOverviewModule,
        RepositoryDetailModule,
        RepositoryFormModule,
    ])
    .service('RepositoryService', RepositoryService)
    .name;
