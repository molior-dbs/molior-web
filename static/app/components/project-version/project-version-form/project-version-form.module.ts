import * as angular from 'angular';

import { ProjectVersionFormComponent } from './project-version-form.component';
import { ProjectVersionCopyComponent } from './project-version-copy.component';

/**
 * This module exists for project form operations.
 */
export const ProjectVersionFormModule = angular
    .module('moliorApp.components.project.version.form', [])
    .component('projectVersionForm', ProjectVersionFormComponent)
    .component('projectVersionCopy', ProjectVersionCopyComponent)
    .name;
