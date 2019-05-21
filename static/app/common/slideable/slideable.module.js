import * as angular from 'angular';

import { SlideToggleDirective } from './slide-toggle.directive';
import { SlideableDirective } from './slideable.directive';

/**
 * @ngdoc overview
 * @name moliorApp.common.slideable
 * @description
 * # moliorApp.common.slideable
 * 
 */
export const SlideableModule = angular
    .module('moliorApp.common.slideable', [])
    .directive('slideable', SlideableDirective)
    .directive('slideToggle', SlideToggleDirective)
    .name;
