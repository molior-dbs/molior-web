// @ts-check
import * as angular from 'angular';

import { BuildstateComponent } from './buildstate.component';
import { BUILDSTATE } from './buildstate.constant';
import { BuildstateService } from './buildstate.service';

/**
 * @ngdoc overview
 * @name moliorApp.components.buildstate
 * @description
 * # moliorApp.components.buildstate
 *  This module handles buildstate related stuff
 */
export const BuildstateModule = angular
    .module('moliorApp.components.buildstate', [])
    .service('BuildstateService', BuildstateService)
    .constant('Buildstate', BUILDSTATE)
    .component('buildstate', BuildstateComponent)
    .name;
