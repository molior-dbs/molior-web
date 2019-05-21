import * as angular from 'angular';

import { ProjectCreationModule } from './project-creation/project-creation-form.module';
import { ProjectFormModule } from './project-form/project-form.module';
import { ProjectOverviewListComponent } from './project-overview/project-overview-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectVersionsComponent } from './project-detail/project-versions.component';
import { ProjectService } from './project.service';

import { registerStates } from '@molior/app.util';
import * as projectStates from './project.states';

/**
 * @ngdoc overview
 * @name moliorApp.components.project
 * @description
 * # moliorApp.components.project
 * This module is here for project operations.
 *
 * @requires moliorApp.components.project.creation
 * @requires moliorApp.components.project.form
 */
export const ProjectModule = angular
    .module('moliorApp.components.project', [
        ProjectCreationModule,
        ProjectFormModule,
    ])
    .service('ProjectService', ProjectService)
    .component('projectOverview', ProjectOverviewComponent)
    .component('projectOverviewList', ProjectOverviewListComponent)
    .component('projectDetail', ProjectDetailComponent)
    .component('projectVersions', ProjectVersionsComponent)
    .config(registerStates(projectStates))
    .name;
