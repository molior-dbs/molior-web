import * as angular from 'angular';

import { MoliorStatusComponent } from './molior-status.component';
import { MoliorStatusService } from './molior-status.service';
import { registerStates } from '@molior/app.util';
import * as moliorStatusStates from './molior-status.states';

export const MoliorStatusModule = angular
    .module('moliorApp.components.moliorStatus', [])
    .service('MoliorStatus', MoliorStatusService)
    .component('moliorStatus', MoliorStatusComponent)
    .config(registerStates(moliorStatusStates))
    .name;
