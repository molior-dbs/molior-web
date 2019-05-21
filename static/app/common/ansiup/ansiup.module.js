import * as angular from 'angular';

import { AnsiupDirective } from './ansiup.directive';

/**
 * @ngdoc overview
 * @name moliorApp.common.ansiup
 * @description
 * # moliorApp.common.ansiup
 *
 */
export const AnsiupModule = angular
    .module('moliorApp.common.ansiup', [])
    .directive('ansiup', AnsiupDirective)
    .name;
