import * as angular from 'angular';

import { registerStates } from '../../app.util';
import { ProjectVersionDetailComponent } from './project-version-detail/project-version-detail.component';
import { ProjectVersionFormModule } from './project-version-form/project-version-form.module';
import { ProjectVersionDependencyComponent } from './project-version-info/project-version-dependency.component';
import { ProjectVersionInfoComponent } from './project-version-info/project-version-info.component';
import { ProjectVersionDependencyFormComponent } from './project-version-info/project-version-dependency-form.component';
import { ProjectVersionService } from './project-version.service';

import * as buildStates from '../build/build.states';
import * as projectVersionStates from './project-version.states';

/**
 * @ngdoc overview
 * @name moliorApp.components.project.version
 * @description
 * # moliorApp.components.project.version
 * This module is here for project version operations.
 *
 * @requires moliorApp.components.project.version.form
 * @requires moliorApp.components.project.version.build
 */
export const ProjectVersionModule = angular
    .module('moliorApp.components.project.version', [
        ProjectVersionFormModule,
    ])
    .component('projectVersionDetail', ProjectVersionDetailComponent)
    .component('projectVersionDependency', ProjectVersionDependencyComponent)
    .component('projectVersionDependencyForm', ProjectVersionDependencyFormComponent)
    .component('projectVersionInfo', ProjectVersionInfoComponent)
    .service('ProjectVersionService', ProjectVersionService)
    .config(registerStates(projectVersionStates))
    .name;
