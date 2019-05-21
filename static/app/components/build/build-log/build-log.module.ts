import * as angular from 'angular';

import { BuildLogDirective } from './build-log.directive';

export const BuildLogModule = angular
    .module('moliorApp.components.build.log', [])
    .directive('buildlog', BuildLogDirective)
    .name;
