import * as angular from 'angular';
import { ProjectCreationFormComponent } from './project-creation-form.component';

/**
 * @ngdoc overview
 * @name moliorApp.components.project.creation
 * @description
 * # moliorApp.components.project.creation
 * This module serves for project creations.
 * It used the {@link moliorApp.components.project.directive:projectForm ProjectForm Directive} and {@link moliorApp.components.project.version.directive:projectVersionForm ProjectVersionForm Directive},
 * in order to create a project.
 */
export const ProjectCreationModule = angular
    .module('moliorApp.components.project.creation', [])
    .component('projectCreationForm', ProjectCreationFormComponent)
    .name;
