import * as angular from 'angular';
import * as toastr from 'toastr';
import { StateService } from '@uirouter/core';
import { UserService } from './user.service';

/**
 * Controller for a user overview. Used in
 * {@link moliorApp.components.user.directive:userOverview User Overview Component}
 */
class UserListController {
    private query: any;
    private users: any;

    constructor(
        private UserService: UserService,
        private $mdDialog: any,
        private $scope: angular.IRootScopeService,
        private $state: StateService,
    ) {
        this.UserService = UserService;
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.$scope = $scope;
        this.$scope.load = () => this.load();
    }

    /**
     * Initializes the component
     */
    public $onInit() {
        this.load();
    }

    /**
     * Sets the user to admin. Displays a
     * toastr message, if it suceeded or failed. Updates
     * the data afterwards.
     *
     * @param {object} user The user to update
     */
    private updateAdmin(user) {
        return this.UserService
            .update(user.id, { is_admin: user.is_admin })
            .then((data: any) => toastr.success(data.result))
            .catch((data) => toastr.error(data.data))
            .then(() => this.load());
    }

    /**
     * Load users data with the given filters
     *
     * @returns {Promise} Promise when everything is laoded
     */
    private async load() {
        this.users = await this.UserService.all(this.query);
        this.$scope.$apply();
    }

    /**
     * Opens a detailed user info dialog
     */
    private showUserInfo(ev, user) {
        return this.$mdDialog.show({
            controller() {
                this.user = user;
            },
            controllerAs: '$ctrl',
            template: `
                <user-detail user="$ctrl.user"></user-detail>
            `,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false,
        });
    }
}

/**
 * This component displays an overview of users.
 *
 * @restrict 'E'
 * @example
 * <pre>
 *    <user-list></user-list>
 * </pre>
 */
export const UserListComponent = {
    template: `
<md-list-item
    ng-click="$ctrl.showUserInfo($event, user)"
    ng-repeat="user in $ctrl.users.results"
    class="user-list"
>
    <strong>{{ user.username }}</strong>
    <md-checkbox class="md-secondary" aria-label="is admin" ng-model="user.is_admin" ng-change="$ctrl.updateAdmin(user)">Admin</md-checkbox>
</md-list-item>
<md-table-pagination md-on-paginate="load" md-limit="$ctrl.query.page_size" md-limit-options="[10, 20, 50]" md-page="$ctrl.query.page" md-total="{{ $ctrl.users.total_result_count }}" md-page-select="true" md-boundary-links="true">
</md-table-pagination>
    `,
    controller: UserListController,
    bindings: {
        query: '<',
    },
};
