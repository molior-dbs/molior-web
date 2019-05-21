import * as angular from 'angular';

import { EditableInputComponent } from './editable-input.component';

/**
 * @ngdoc overview
 * @name moliorApp.common.editableInput
 * @description
 * # moliorApp.common.editableInput
 * 
 * Module for a editable input comoponent.
 */
export const EditableInputModule = angular
    .module('moliorApp.common.editableInput', [])
    .component('editableInput', EditableInputComponent)
    .name;
