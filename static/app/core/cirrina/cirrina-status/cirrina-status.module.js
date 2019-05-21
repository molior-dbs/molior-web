// @ts-check
import * as angular from 'angular';
import {
    CirrinaStatus
} from './cirrina-status.factory';
import {
    WEBSOCKET_STATUS
} from './websocket-status.constant';

/**
 * @ngdoc overview
 * @name moliorApp.core.cirrina.status
 * @description
 * # moliorApp.core.cirrina.status
 *
 * Handles websocket status updates
 */
export const StatusModule = angular
    .module('moliorApp.core.cirrina.status', [])
    .constant('WEBSOCKET_STATUS', WEBSOCKET_STATUS)
    .service('CirrinaStatus', CirrinaStatus)
    .name;
