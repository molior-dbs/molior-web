import * as angular from 'angular';
import {
    LogType
} from './log-type.constant';
import {
    LogFactory
} from './log.service';

/**
 * @ngdoc overview
 * @name moliorApp.common.log
 * @description
 * moliorApp.common.log
 * Logging layer for molior.
 */
export const LogModule = angular
    .module('moliorApp.common.log', [])
    .constant('LogType', LogType)
    .service('Log', LogFactory)
    .name;
