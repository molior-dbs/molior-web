import * as angular from 'angular';
import { Notify } from './notify.service';

/**
 * @ngdoc overview
 * @name moliorApp.common.log
 * @description
 * moliorApp.common.log
 * Logging layer for molior.
 */
export const NotifyModule = angular
    .module('moliorApp.common.notify', [])
    .service('Notify', Notify)
    .name;
