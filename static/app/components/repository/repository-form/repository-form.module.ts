import * as angular from 'angular';

import { RepositoryConfirmationComponent } from './repository-confirmation.component';
import { RepositoryFormComponent } from './repository-form.component';
import { RepositoryMetadataFormComponent } from './repository-metadata-form.component';

/**
 * @ngdoc overview
 * @name moliorApp.components.repository.form
 * @description
 * # moliorApp.components.repository.form
 */
export const RepositoryFormModule = angular
    .module('moliorApp.repository.form', [])
    .component('repositoryForm', RepositoryFormComponent)
    .component('repositoryMetadataForm', RepositoryMetadataFormComponent)
    .component('repositoryConfirmation', RepositoryConfirmationComponent)
    .name;
