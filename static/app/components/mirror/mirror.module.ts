import * as angular from 'angular';

import { registerStates } from '@molior/app.util';
import { MirrorFormComponent } from './mirror-form.component';
import { MirrorOverviewComponent } from './mirror-overview.component';
import { MirrorState } from './mirror-state.constant';
import { MirrorService } from './mirror.service';
import * as mirrorStates from './mirror.states';

/**
 * @ngdoc overview
 * @name moliorApp.components.mirror
 * @description
 * # moliorApp.components.mirror
 * This module is here for mirror operations.
 *
 */
export const MirrorModule = angular
    .module('moliorApp.components.mirror', [])
    .component('mirrorOverview', MirrorOverviewComponent)
    .constant('MirrorState', MirrorState)
    .service('MirrorService', MirrorService)
    .component('mirrorForm', MirrorFormComponent)
    .config(registerStates(mirrorStates))
    .name;
