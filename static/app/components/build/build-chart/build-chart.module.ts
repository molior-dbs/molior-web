import * as angular from 'angular';

import { BuildChartDirective } from './build-chart.directive';

export const BuildChartModule = angular
    .module('moliorApp.components.build.chart', [])
    .directive('buildChart', BuildChartDirective)
    .name;
