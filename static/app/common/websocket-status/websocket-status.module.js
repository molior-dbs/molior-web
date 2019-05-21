// @ts-check
import * as angular from 'angular';
import {
    WebsocketStatusComponent
} from './websocket-status.component';

/**
 * @ngdoc overview
 * @name moliorApp.common.websocketStatus
 * @description
 * # moliorApp.common.websocketStatus
 * A small circle, which indicates, using Cirrina, if the
 * websocket service is connected (green) or disconnected (red)
 * 
 */
export const WebsocketStatusModule = angular
    .module('moliorApp.common.websocketStatus', [])
    .component('websocketStatus', WebsocketStatusComponent)
    .name;
