import * as angular from 'angular';

import { Favicon } from './favicon.service.js';
import { FaviconDirective } from './favicon.directive';
import { FaviconType } from './favicon-type.constant';
import { FaviconHook } from './favicon.hook';

/**
 * @ngdoc overview
 * @name moliorApp.common.favicon
 * @description
 * # moliorApp.common.favicon
 * The module for favicon operations.
 *
 */
export const FaviconModule = angular
    .module('moliorApp.common.favicon', [])
    .service('Favicon', Favicon)
    .constant('FaviconType', FaviconType)
    .directive('favicon', FaviconDirective)
    .run(FaviconHook)
    .name;
