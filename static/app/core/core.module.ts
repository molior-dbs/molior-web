import * as angular from 'angular';

import { ApiModule } from './api/api.module';
import { CirrinaModule } from './cirrina/cirrina.module';

/**
 * Module for core / general molior functionality
 *
 * @requires moliorApp.core.api
 * @requires moliorApp.core.cirrina
 */

export const CoreModule = angular
    .module('moliorApp.core', [
        ApiModule,
        CirrinaModule,
    ])
    .name;
