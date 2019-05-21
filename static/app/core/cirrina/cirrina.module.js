// @ts-check
import * as angular from 'angular';
import {
    Cirrina
} from './cirrina.service';
import {
    CirrinaAction
} from './cirrina-action.constant';
import {
    CirrinaEvent
} from './cirrina-event.constant';
import {
    CirrinaSubject
} from './cirrina-subject.constant';
import {
    ObserverModule
} from './cirrina-observer/cirrina-observer.module';
import {
    StatusModule
} from './cirrina-status/cirrina-status.module.js';
import {
    WebsocketModule
} from './cirrina-websocket/cirrina-websocket.module.js';
/**
 * @ngdoc overview
 * @name moliorApp.core.cirrina
 * @description
 * # moliorApp.core.cirrina
 *
 * Handles the websocket connections of molior
 * using Cirrina.
 *
 * @requires moliorApp.core.cirrina.status
 * @requires moliorApp.core.cirrina.websocket
 * @requires moliorApp.core.cirrina.observer
 */

export const CirrinaModule = angular
    .module('moliorApp.core.cirrina', [
        StatusModule,
        WebsocketModule,
        ObserverModule
    ])
    .service('Cirrina', Cirrina)
    .constant('CirrinaAction', CirrinaAction)
    .constant('CirrinaEvent', CirrinaEvent)
    .constant('CirrinaSubject', CirrinaSubject)
    .name;
