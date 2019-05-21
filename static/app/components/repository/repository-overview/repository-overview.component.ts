import './repository-overview.style.scss';

import * as angular from 'angular';

import { StateService } from '@uirouter/core';
import { RepositoryService } from '../repository.service';
import { IComponentOptions } from 'angular';

/**
 * @ngdoc controller
 * @name moliorApp.components.repository.overview.controller:RepositoryOverviewController
 * @description
 * The component, which shows all repositories in a filterable and
 * paginateable table. Automaticly loads the data and resets the filter, when
 * the controller gets initialized
 *
 * @requires $q
 * @requires $mdDialog
 * @requires moliorApp.util.service:Util
 * @requires moliorApp.log.service:Log
 * @requires $scope
 * @requires $state
 * @requires moliorApp.components.repository.overview.service:RepositoryService
 */
class RepositoryOverviewController {
    private repository = {};
    private pageSize = 20;
    private filters;
    private logger: any;
    private page: any;
    private isLoading: boolean;
    private openDialog: any;
    private user: any;
    private version: any;
    private deferred: Promise<void>;
    private searchText: any;
    private project: any;

    constructor(
        private $q: any,
        private $mdDialog: any,
        private Util: any,
        private Log: any,
        private $scope: angular.IRootScopeService,
        private $state: StateService,
        private RepositoryService: RepositoryService,
        private $timeout: any,
        private Auth: any,
    ) {
        this.logger = this.Log.init('RepositoryOverviewComponent');
        $scope.$watchCollection(
            () => this.filters,
            () => this.updateURL(),
        );
        $scope.$watchCollection(
            () => this.page,
            () => this.updateURL(),
        );
        this.$scope = $scope;
        this.$scope.load = () => this.load();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.overview.controller:RepositoryOverviewController#$onInit
     * @methodOf moliorApp.components.repository.overview.controller:RepositoryOverviewController
     *
     * @description
     * Initializes the component
     */
    public $onInit() {
        this.isLoading = true;
        this.user = this.Auth.session;
        this.Auth
            .session
            .onChange()
            .then((session) => this.user = session);
        this.load();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.overview.controller:RepositoryOverviewController#load
     * @methodOf moliorApp.components.repository.overview.controller:RepositoryOverviewController
     *
     * @description
     * Loads the repositories with the bound filters and binds them
     *
     * @example
     * <pre>
     * this.pageSize = 25;
     * this.page = 1;
     * this.filters = {
     *    'name': 'ts',
     *    'url': 'tsp.git'
     * };
     * this.version.id = 1;
     * this.load();
     * console.log(this.repository.results);
     * consoel.log(this.repository.totalResultCount);
     * </pre>
     */
    public load() {
        this.logger.info('Applied Filters: ', this.filters);
        this.logger.info('Page: ' + this.page + ', Page Size: ' + this.pageSize);
        const requestOptions = {
            page: this.page - 1,
            per_page: this.pageSize,
            q: this.filters,
            project_version_id: this.version.id,
        };
        this.deferred = this.RepositoryService
            .byFilter(requestOptions)
            .then((result) => {
                // Get bitbucket url and bind to controller
                this.repository = {
                    results: result.results.map((repository) => {
                        return repository;
                    }),
                    totalResultCount: result.total_result_count,
                };
                this.isLoading = false;
            });
        return this.deferred;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.overview.controller:RepositoryOverviewController#querySearch
     * @methodOf moliorApp.components.repository.overview.controller:RepositoryOverviewController
     *
     * @description
     * Searches through the given list for a name like
     * `this.searchText`
     *
     * @param {Object[]} list The list which should get filtered
     *
     * @returns {Object[]} The filtered list
     * <pre>
     * var items = [{name: "abss", "gas", "ewqr"}];
     * this.searchText = "a";
     * this.querySearch(items); // ["abss", "gas"]
     * </pre>
     */
    private querySearch(list) {
        return list.filter((item) => item.name.indexOf(this.searchText));
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.overview.controller:RepositoryOverviewController#openRepositoryFormModal
     * @methodOf moliorApp.components.repository.overview.controller:RepositoryOverviewController
     *
     * @description
     * Opens the new / import repository form in a modal using
     * `$mdDialog`.
     *
     * @param {Event} ev? The sent $event from the UI.
     */
    private openRepositoryFormModal(ev) {
        if (this.version.is_locked) {
            return;
        }
        const $ctrl = this;

        // Change dialog-scope to the same scope as parent
        const dialogController = function() {
            this.parent = $ctrl;
        };

        const dialogOptions = {
            template: `<repository-form version="$ctrl.parent.version" project="$ctrl.parent.project"></repository-form>`,
            parent: angular.element(document.body),
            targetEvent: ev,
            controller: dialogController,
            controllerAs: '$ctrl',
        };

        this.$mdDialog
            .show(dialogOptions)
            .finally(() => this.load());
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.overview.controller:RepositoryOverviewController#updateURL
     * @methodOf moliorApp.components.repository.overview.controller:RepositoryOverviewController
     *
     * @description
     * Updates the URL, depending on the bound filters
     *
     */
    private updateURL() {
        this.$state.transitionTo('project-version.repository.overview.filter', {
            page: this.page,
            url: this.filters.url,
            name: this.filters.name,
            projectId: this.project.id,
            versionId: this.version.id,
        },
        {
            inherit: true,
            relative: this.$state.$current,
            notify: false,
            reload: false,
            location: 'replace',
        });
    }
}

/**
 *
 * @ngdoc directive
 * @name moliorApp.components.repository.overview.directive:repositoryOverview
 * @description
 * The component, which shows all repositories in a filterable and
 * paginateable table.
 *
 * @param {object} project The project of which the repositories should get displayed
 * @param {object} version The projectversion if which the repositories should get displayed
 * @param {object} filters The filters which should be preset for the table
 * @param {number} page The current pagenumber of the table
 * @param {boolean} openDialog If it should open the dialog on init
 * @param {object} buildvariants List of all buildvariants
 * @param {string}  role The role of the user as string
 * @restrict 'E'
 */
export const RepositoryOverviewComponent: IComponentOptions = {
    template: `<div class="repositories">
    <header layout="row" layout-margin>
        <h4 flex>Repositories</h4>
        <md-button class="md-primary md-raised" ng-if="$ctrl.user.isAdmin || $ctrl.role.role === 'owner' || $ctrl.role.role === 'member'" ng-click="$ctrl.openRepositoryFormModal($event)" ng-disabled="$ctrl.version.is_locked">Add repository</md-button>
    </header>
    <md-card>
        <md-table-container>
            <table md-table md-progress="$ctrl.deferred">
                <thead md-head>
                    <tr>
                        <th>
                            <md-autocomplete md-search-text-change="$ctrl.load()" md-selected-item-change="$ctrl.load()" md-search-text="$ctrl.filters.name"
                                md-items="item in []" md-item-text="item.name" md-min-length="0" placeholder="Name">
                                <md-item-template>
                                    <span md-highlight-text="$ctrl.filters.name" md-highlight-flags="^i">{{item.name}}</span>
                                </md-item-template>
                            </md-autocomplete>
                        </th>
                        <th>
                            <md-autocomplete md-search-text-change="$ctrl.load()" md-selected-item-change="$ctrl.load()" md-search-text="$ctrl.filters.url"
                                md-items="item in []" md-item-text="item.url" md-min-length="0" placeholder="Url">
                                <md-item-template>
                                    <span md-highlight-text="$ctrl.filters.url" md-highlight-flags="^i">{{item.url}}</span>
                                </md-item-template>
                            </md-autocomplete>
                        </th>
                        <th md-column>
                            Architectures
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr repository-item version="$ctrl.version" ng-repeat="repository in $ctrl.repository.results" repository="repository"></tr>
                    <tr ng-if="$ctrl.isLoading === false && $ctrl.repository.totalResultCount === 0">
                        <td colspan="4">
                            <div layout="row" layout-align="center center">
                                <span>No Repository found.
                                    <a ng-if="!$ctrl.version.is_locked" ng-click="$ctrl.openRepositoryFormModal($event)">Create one.</a>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
        <md-table-pagination md-on-paginate="load" md-limit="$ctrl.pageSize" md-page="$ctrl.page" md-total="{{$ctrl.repository.totalResultCount}}"></md-table-pagination>
    </md-card>
</div>`,
    controller: RepositoryOverviewController,
    bindings: {
        project: '<',
        version: '<',
        filters: '<',
        page: '<',
        buildvariants: '<',
        role: '<',
    },
};
