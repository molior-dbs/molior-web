import * as angular from 'angular';

import { BuildvariantPickerDirective } from './buildvariant-picker.directive';
import { BuildvariantService } from './buildvariant.service';

/**
 * @ngdoc overview
 * @name moliorApp.components.buildvariant
 * @description
 * # moliorApp.components.buildvariant
 */
export const BuildvariantModule = angular
    .module('moliorApp.components.buildvariant', [])
    .service('BuildvariantService', BuildvariantService)
    .directive('buildvariantPicker', BuildvariantPickerDirective)
    .name;
