// @ts-check
import * as angular from 'angular';
import {
    Auth,
} from './auth.service';
import { RequiresAuthHook } from './requires-auth.hook';
import { GotoLoginOnAuthChange} from './goto-login.hook';

/**
 * @ngdoc overview
 * @name moliorApp.core.auth
 * @description
 * # moliorApp.core.auth
 *
 * Handles the Authorization of a user
 *
 */
export const AuthModule = angular
    .module('moliorApp.core.api.auth', [])
    .service('Auth', Auth)
    .run(RequiresAuthHook)
    .run(GotoLoginOnAuthChange)
    .name;
