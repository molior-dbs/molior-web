import * as angular from 'angular';

import { MoliorHeaderComponent } from './molior-header.component';
import { WebsocketStatusModule } from '../websocket-status/websocket-status.module';

/**
 * This module handles the header of molior.
 */
export const MoliorHeaderModule = angular
    .module('moliorApp.common.moliorHeader', [
        WebsocketStatusModule,
    ])
    .component('moliorHeader', MoliorHeaderComponent)
    .name;
