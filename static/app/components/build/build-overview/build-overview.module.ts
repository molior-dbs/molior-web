import * as angular from 'angular';

import { BuildItemDirective } from './build-item.directive';
import { BuildOverviewComponent } from './build-overview.component';

/**
 * @ngdoc overview
 * @name moliorApp.components.build.overview
 * @description
 * # moliorApp.components.build.overview
 *
 */
export const BuildOverviewModule = angular
    .module('moliorApp.components.build.overview', [])
    .directive('buildItem', BuildItemDirective)
    .component('buildOverview', BuildOverviewComponent)
    .name;
