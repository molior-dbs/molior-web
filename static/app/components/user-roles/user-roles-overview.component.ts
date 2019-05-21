import * as toastr from 'toastr';

import { UserRoleService } from './user-role.service';
import { StateParams, StateService } from '@uirouter/core';
import { IRootScopeService } from 'angular';
import { UserService } from '../user/user.service';

/**
 * The controller for an overview for users of the current project.
 */
class UserRolesOverviewController {
    private deferred: Promise<any>;
    private project: any;
    private query: any;
    private results: any;
    private role: string;
    private user: any;
    private user_roles: any[];

    constructor(
        private UserRoleService: UserRoleService,
        private $stateParams: StateParams,
        private $mdDialog: any,
        private $scope: IRootScopeService,
        private $state: StateService,
        private UserService: UserService,
    ) { }

    /**
     * Loads the users of the current project and binds them the controller.
     *
     * @example
     * <pre>
     *    $ctrl.query = {
     *         page: 1,
     *         pageSize: 25,
     *         filter_name: 'a'
     *     };
     *     $ctrl.project = {
     *         id: 1
     *     };
     *     $ctrl.load();
     * </pre>
     */
    public load() {
        this.deferred = this.UserService
            .byProject(this.project.id, {
                page: this.query.page,
                page_size: this.query.pageSize,
                filter_name: this.query.filter_name,
                filter_role: this.query.filter_role,
            })
            .then((results) => this.results = results);
    }

    /**
     * Opens the user add dialog.
     *
     * @param {Event} ev The $event from te ui
     */
    public addUser(ev) {
        const parent = this;
        this.$mdDialog
            .show({
                template: `
                <user-form project="$ctrl.parent.project" user-roles="$ctrl.parent.user_roles"></user-form>
                `,
                targetEvent: ev,
                controller: () => {
                    return {
                        parent,
                    };
                },
                bindToController: true,
                controllerAs: '$ctrl',
                clickOutsideToClose: true,
                fullscreen: false,
            })
            .then(() => this.load());
    }

    /**
     * Opens a confirmation popup and removes the user from the database.
     *
     * @param {Event} ev The $event from te ui
     * @param {Number} user_id The user id to delete
     * @param {String} username The username which should get displayed.
     */
    public delUser(ev, userId, username) {
        const confirm = this.$mdDialog.confirm()
            .title('Confirmation')
            .textContent('REMOVE ' + username + ' from this project ?')
            .ariaLabel('Confirm user removal')
            .targetEvent(ev)
            .ok('REMOVE')
            .cancel('Abort');

        this.$mdDialog
            .show(confirm)
            .then(() => {
                this.UserRoleService
                    .remove(this.project.id, userId)
                    .then((data) => toastr.success(data.result))
                    .catch((data) => toastr.error(`Cannot remove role on ${this.project.name} : ${data.data}`));
                this.load(); // reload the data
            });
    }

    /**
     * Gets called when the md-select gets closed, which have roles in it
     *
     * @param {Number} index The index of roles list
     */
    public onRoleListClose(index) {
        this.UserRoleService.put(
            this.project.id,
            this.results.results[index].id,
            this.results.results[index].role)
            .then((data) => toastr.success(data.result))
            .catch((data) => toastr.error(`Cannot set role on ${this.project.name} : ${data.data}`));
        this.load(); // reload the data
    }

    /**
     * @ngdoc
     * @name moliorApp.components.user.roles.controller:UserRolesOverviewController#canEdit
     * @methodOf moliorApp.components.user.roles.controller:UserRolesOverviewController
     *
     * @description
     * Checks if the current user can edit the page or not.
     *
     * @returns {Boolean} If the current user can edit or not.
     */
    public canEdit() {
        return this.role === 'owner' || this.user.is_admin;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.user.roles.controller:UserRolesOverviewController#updateURL
     * @methodOf moliorApp.components.user.roles.controller:UserRolesOverviewController
     *
     * @description
     * Updates the URL, depending on the bound filters
     *
     */
    public updateURL() {
        let statename = '.filter';

        if (this.$state.current.name.indexOf('.filter') !== -1) {
            statename = '^' + statename;
        }
        this.$state.transitionTo(statename, {
            page: this.query.page,
            pageSize: this.query.pageSize,
            filter_name: this.query.filter_name,
            filter_role: this.query.filter_role,
        }, {
            inherit: true,
            relative: this.$state.$current,
            notify: false,
            reload: false,
            location: 'replace',
        });
    }

    /**
     * Initializes the component
     */
    public $onInit() {
        this.user_roles = [];
        this.$scope.$watchCollection(() => this.query, () => this.updateURL());
        this.UserRoleService
            .all()
            .then((data) => this.user_roles = data)
            .catch((data) => toastr.error('Error loading user roles !', data));

        this.load();
    }
}

/**
 * This component displays an overview of users and their roles, related to a project.
 *
 * @param {Object} project The project of which the users should get displayed
 * @param {Object} version The projectversion of which the users should get displayed
 * @param {Object} role The role of the logged in user
 * @param {Object} query The filter which get set in the table
 * @restrict 'E'
 */
export const UserRolesOverviewComponent = {
    template: `
<div class="user-roles">
    <header layout="row" layout-margin>
        <h4 flex>Projectroles</h4>
        <md-button ng-if="$ctrl.canEdit()" class="md-primary md-raised" ng-click="$ctrl.addUser($event);">Add User to Project</md-button>
    </header>
    <md-card>
        <md-table-container>
            <table md-table md-progress="$ctrl.deferred">
                <thead md-head>
                    <tr md-row>
                        <th>
                            <md-autocomplete md-search-text-change="$ctrl.load()" md-selected-item-change="$ctrl.load()" md-search-text="$ctrl.query.filter_name" md-items="item in []" placeholder="User">
                            </md-autocomplete>
                        </th>
                        <th>
                            <md-autocomplete md-search-text-change="$ctrl.load()" md-selected-item-change="$ctrl.load()" md-search-text="$ctrl.query.filter_role" md-items="item in []" placeholder="Role">
                            </md-autocomplete>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody md-body class="md-body">
                    <tr md-row ng-repeat="userrole in $ctrl.results.results">
                        <td md-cell>{{ userrole.username }}</td>
                        <td md-cell>
                            <form ng-if="$ctrl.canEdit()">
                                <md-input-container>
                                    <md-select md-on-close="$ctrl.onRoleListClose($index)" ng-model="$ctrl.results.results[$index].role" aria-label="select role">
                                        <md-option ng-value="role" aria-label="role" ng-repeat="role in $ctrl.user_roles">{{ role }}</md-option>
                                    </md-select>
                                </md-input-container>
                            </form>
                            <div ng-if="!$ctrl.canEdit()">{{userrole.role}}</div>
                        </td>
                        <td md-cell>
                            <div ng-if="$ctrl.canEdit()">
                                <md-button ng-click="$ctrl.delUser($event, userrole.id, userrole.username);" class="md-icon-button" aria-label="remove user from project">
                                    <ng-md-icon icon="delete" style="fill:#9e9e9e;"></ng-md-icon>
                                </md-button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
        <md-table-pagination md-on-paginate="load" md-limit="$ctrl.query.pageSize" md-limit-options="[10, 20, 50]" md-page="$ctrl.query.page" md-total="{{ $ctrl.results.total_result_count }}" md-page-select="true" md-boundary-links="true" />
    </md-card>
</div>`,
    controller: UserRolesOverviewController,
    bindings: {
        project: '<',
        version: '<',
        role: '<',
        user: '<',
        query: '<',
    },
};
