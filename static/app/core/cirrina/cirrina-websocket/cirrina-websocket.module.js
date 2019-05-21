// @ts-check
import * as angular from 'angular';
import {
    CirrinaWebsocketFactory
} from './cirrina-websocket.provider.js';
/**
 * @ngdoc overview
 * @name moliorApp.core.cirrina.websocket
 * @description
 * # moliorApp.core.cirrina.websocket
 *
 * Wrapper around websocket instance tied for
 * Cirrina
 * 
 * @requires ngSocket
 */
export const WebsocketModule = angular
    .module('moliorApp.core.cirrina.websocket', [
        'ngSocket'
    ])
    .provider('CirrinaWebsocket', CirrinaWebsocketFactory)
    .name;
