import * as angular from 'angular';
import { ProjectFormDirective } from './project-form.directive';

/**
 * @ngdoc overview
 * @name moliorApp.components.project.form
 * @description
 * # moliorApp.components.project.form
 * This module is here for project form operations.
 */
export const ProjectFormModule = angular
    .module('moliorApp.components.project.form', [])
    .directive('projectForm', ProjectFormDirective)
    .name;
