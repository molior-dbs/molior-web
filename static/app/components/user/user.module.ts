import * as angular from 'angular';

import { registerStates } from '@molior/app.util';
import { UserDetailComponent } from './user-detail.component';
import { UserListComponent } from './user-list.component';
import { UserOverviewComponent } from './user-overview.component';
import { AddUserFormComponent } from './add-user-form.component';
import { UserService } from './user.service';
import * as userStates from './user.states';

/**
 * @ngdoc overview
 * @name moliorApp.components.user
 * @description
 * # moliorApp.components.user
 *
 */
export const UserModule = angular
    .module('moliorApp.components.user', [])
    .service('UserService', UserService)
    .component('userOverview', UserOverviewComponent)
    .component('userDetail', UserDetailComponent)
    .component('userList', UserListComponent)
    .component('addUserForm', AddUserFormComponent)
    .config(registerStates(userStates))
    .name;
