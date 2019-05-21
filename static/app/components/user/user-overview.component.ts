import * as angular from 'angular';
import * as toastr from 'toastr';
import { StateService } from '@uirouter/core';
import { UserService } from './user.service';

/**
 * Controller for a user overview. Used in
 */
class UserOverviewController {
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
    }

    /**
     * Initializes the component
     */
    public $onInit() {
        this.$scope.$watchCollection(
            () => this.query,
            () => this.updateURL(),
        );
    }

    /**
     * Updates the URL, depending on the bound filters
     */
    private updateURL() {
        this.$state.transitionTo('users.list', this.query, {
            inherit: true,
            relative: this.$state.$current,
            notify: false,
            reload: false,
            location: 'replace',
        });
    }

    /**
     * Opens a new dialog to create a user
     * @param $event Event which creates dialog
     */
    private openNewUserDialog($event: any) {
        this.$mdDialog
            .show({
                template: `<add-user-form></add-user-form>`,
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
            });
    }
}

/**
 * This component displays an overview of users.
 *
 * @restrict 'E'
 * @example
 * <pre>
 *    <user-overview></user-overview>
 * </pre>
 */
export const UserOverviewComponent = {
    template: `
<div class="user-overview">
    <div flex-gt-xs="100" flex-offset-gt-xs="0" class="project-version-detail-subnav">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="row" layout-align="space-between end">
            <h2 layout-margin class="title-spaceing">
                <strong>Users</strong>
            </h2>
            <form name="user.form">
                <md-button class="md-primary md-raised molior-header-button" ng-click="$ctrl.openNewUserDialog($event)">Create User</md-button>
            </form>
        </div>
    </div>
    <md-card flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10">
        <div layout="row" class="project-overview-filter" layout-align="space-between center">
            <div flex="60">
                <md-autocomplete md-search-text-change="$ctrl.load()" md-search-text="$ctrl.query.q" md-items="item in []" placeholder="Name"></md-autocomplete>
            </div>
            <div flex="40">
                <div class="admin-only" layout-align="end center" layout="row">
                    <span>Only Admin</span>
                    <md-checkbox ng-change="$ctrl.load()" ng-model="$ctrl.query.filter_admin" aria-label="Only Admin" flex></md-checkbox>
                </div>
            </div>
        </div>
        <div ui-view>
        </div>
    </md-card>
</div>
    `,
    controller: UserOverviewController,
    bindings: {
        query: '<',
    },
};
