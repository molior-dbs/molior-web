// @ts-check
import * as angular from 'angular';
import {
    Observer
} from './cirrina-observer.factory';

/**
 * @ngdoc overview
 * @name moliorApp.core.cirrina.observer
 * @description
 * # moliorApp.core.cirrina.observer
 *
 * Wrapper around RxJS observer. 
 *
 * @requires moliorApp.core.cirrina.status
 * @requires moliorApp.core.cirrina.websocket
 */

export const ObserverModule = angular
    .module('moliorApp.core.cirrina.observer', [])
    .factory('Observer', () => Observer)
    .name;
