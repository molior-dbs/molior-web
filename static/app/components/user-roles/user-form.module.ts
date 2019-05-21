import * as angular from 'angular';

import { UserFormComponent } from './user-form.component';
import { UserRoleService } from './user-role.service';
import { UserRolesOverviewComponent } from './user-roles-overview.component';

/**
 * # moliorApp.components.user.roles
 */
export const UserRolesModule = angular
    .module('moliorApp.components.user.roles', [])
    .component('userForm', UserFormComponent)
    .service('UserRoleService', UserRoleService)
    .component('userRolesOverview', UserRolesOverviewComponent)
    .name;
