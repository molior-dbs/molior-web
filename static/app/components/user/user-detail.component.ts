import './user-detail.style.scss';

import * as toastr from 'toastr';
import { UserRoleService } from '../user-roles/user-role.service';
import _ = require('lodash');

/**
 * The detail view of a user
 */
export class UserDetailController {
    private user: any;
    private userRoles: any[];

    constructor(
        private UserRoleService: UserRoleService,
        private $mdDialog: any,
    ) { }

    /**
     * Initializes the component
     */
    public $onInit() {
        this.load();
    }

    /**
     * Load users data
     *
     * @returns {Promise} The promise when everything is loaded
     */
    public load() {
        return this.UserRoleService
            .byUser(this.user.id)
            .then((result) => this.mapUserinfo(result))
            .catch((data) => toastr.error('Could not load user roles', data));
    }

    public mapUserinfo(userinfo) {
        this.userRoles = [];
        _(userinfo.roles)
            .keys()
            .forEach((role) =>
                userinfo.roles[role].forEach((project) => {
                    this.userRoles.push({ project, role });
                }),
            );
    }

    /**
     * Cancels the dialog
     */
    public cancel() {
        this.$mdDialog.cancel();
    }
}

/**
 * The detail view of a user
 * @restrict 'E'
 *
 * @param {object} user The user to display
 */
export const UserDetailComponent = {
    template: `
    <div class="user-detail">
        <md-toolbar>
            <div class="md-toolbar-tools">
                <h2>{{ $ctrl.user.username }}</h2>
                <span flex></span>
                <md-button class="md-icon-button" ng-click="$ctrl.cancel()">
                    <ng-md-icon aria-label="Close dialog" icon="close" size="30" class="close-icon"></ng-md-icon>
                </md-button>
            </div>
        </md-toolbar>
        <md-content>
            <table md-table ng-if="$ctrl.userRoles.length > 0">
                <thead md-head>
                    <tr md-row>
                       <th md-column>Project</th>
                       <th md-column>Role</th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr md-row ng-repeat="role in $ctrl.userRoles">
                        <td md-cell>
                            <a ng-bind="role.project.name" ui-sref="project({projectId: role.project.id})"></a>
                        </td>
                        <td md-cell ng-bind="role.role"></td>
                    </tr>
                </tbody>
            </table>
            <i ng-if="$ctrl.userRoles.length == 0">No roles assigned</i>
        </md-content>
    </div>
    `,
    controller: UserDetailController,
    bindings: {
        user: '<',
    },
};
