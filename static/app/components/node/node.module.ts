import * as angular from 'angular';

import { registerStates } from '@molior/app.util';
import { NodeOverviewComponent } from './node-overview.component';
//import { NodeOverviewComponent, NodeListComponent } from './node-overview.component';
import { NodeService } from './node.service';
import * as nodeStates from './node.states';

/**
 * @ngdoc overview
 * @name moliorApp.components.node
 * @description
 * # moliorApp.components.node
 *
 */
export const NodeModule = angular
    .module('moliorApp.components.node', [])
    .service('NodeService', NodeService)
    .component('nodeOverview', NodeOverviewComponent)
//    .component('nodeList', NodeListComponent)
    .config(registerStates(nodeStates))
    .name;
