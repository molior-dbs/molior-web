import * as angular from 'angular';
import { AuthModule } from './auth/auth.module';
import { InfoModule } from './info/info.module';

/**
 * Connection between molior API and client
 *
 * @requires moliorApp.core.api.auth
 * @requires moliorApp.core.api.info
 */

export const ApiModule = angular
    .module('moliorApp.core.api', [
        AuthModule,
        InfoModule,
    ])
    .name;
