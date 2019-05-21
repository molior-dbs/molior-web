import * as angular from 'angular';

import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedService } from './getting-started.service';
import { registerStates } from '@molior/app.util';
import * as gettingStartedStates from './getting-started.states';

/**
 * This module is here for everything getting started related.
 */
export const GettingStartedModule = angular
    .module('moliorApp.components.gettingStarted', [])
    .component('gettingStarted', GettingStartedComponent)
    .service('GettingStartedService', GettingStartedService)
    .config(registerStates(gettingStartedStates))
    .name;
