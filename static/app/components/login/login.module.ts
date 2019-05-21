import * as angular from 'angular';

import { registerStates } from '@molior/app.util';
import { LoginComponent } from './login.component';

import { loginState } from './login.states';

/**
 * @ngdoc overview
 * @name moliorApp.components.login
 * @description
 * # moliorApp.components.login
 *
 * Displays the starting login page.
 * Handles the authorization for a user.
 *
 */
export const LoginModule = angular
    .module('moliorApp.components.login', [])
    .component('login', LoginComponent)
    .config(registerStates({ loginState }))
    .name;
