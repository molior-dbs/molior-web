import * as angular from 'angular';

import { BuildDetailComponent } from './build-detail.component';

/**
 * @ngdoc overview
 * @name moliorApp.components.build.detail
 * @description
 * # moliorApp.components.build.detail
 */
export const BuildDetailModule = angular
    .module('moliorApp.components.build.detail', [])
    .component('buildDetail', BuildDetailComponent)
    .name;
