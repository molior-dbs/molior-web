import * as angular from 'angular';

import { FocusMeDirective } from './focus-me.directive';

/**
 * @ngdoc overview
 * @name moliorApp.common.focusMe
 * @description
 * # moliorApp.common.focusMe
 *
 */
export const FocusMeModule = angular
    .module('moliorApp.common.focusMe', [])
    .directive('focusMe', FocusMeDirective)
    .name;
