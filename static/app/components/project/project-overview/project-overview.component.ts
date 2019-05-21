import './project-overview.style.scss';

import * as angular from 'angular';

import { StateService } from '@uirouter/angularjs';

import { MoliorApiResponse, PaginationQuery } from '@molior/core';
import { ProjectService } from '../project.service';

/**
 * @ngdoc controller
 * @name moliorApp.components.project.controller:ProjectOverviewController
 * @description
 * Handles the project overview functionality. This controller is used by {@link moliorApp.components.project.directive:projectOverview ProjectOverview Component}
 *
 *
 * @requires $mdDialog
 * @requires $state
 * @requires $scope
 * @requires moliorApp.log.service:Log
 * @requires moliorApp.components.project.service:ProjectService
 * @requires moliorApp.core.api.auth.service:Auth
 */
class ProjectOverviewController {
    private query: { q: string };
    private user;
    private logger;

    constructor(
        private $mdDialog,
        private $state: StateService,
        private Log,
        private Auth,
        private ProjectService: ProjectService) {
    }

    /**
     * @ngdoc
     * @name moliorApp.components.project.controller:ProjectOverviewController#$onInit
     * @methodOf moliorApp.components.project.controller:ProjectOverviewController
     *
     * @description
     * Initializes the component
     */
    public $onInit() {
        this.logger = this.Log.init('ProjectOverviewComponent');

        this.user = this.Auth.session;
        this.Auth.session
            .onChange()
            .then((session) => this.user = session);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.project.controller:ProjectOverviewController#openNewProjectDialog
     * @methodOf moliorApp.components.project.controller:ProjectOverviewController
     *
     * @description
     * Opens the new project dialog using $mdDialog.
     * Calls the {@link moliorApp.components.project.creation Project Creation Component}.
     *
     * @param  {Event} ev The event from the UI
     * @example
     * <pre>
     * <div ng-click='$ctrl.openNewProjectDialog($event)'></div>
     * </pre>
     */
    public openNewProjectDialog(ev) {
        this.$mdDialog
            .show({
                template: `
                    <project-creation-form></project-version-form>
                `,
                parent: angular.element(document.body),
                targetEvent: ev,
            }).finally(() => this.$state.reload());
    }

    /**
     * Updates the URL, depending on the bound filters
     */
    public updateURL() {
        this.$state.transitionTo('project.list', this.query, {
            inherit: true,
            relative: this.$state.$current,
        });
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.directive:projectOverview
 * @description
 * This component displays an overview of projects.
 * It can be filtered using a searchbox.
 * It also has a Create Project button, which creates a new project
 * and a project version.
 *
 * @restrict 'E'
 *
 * @param {Object} query The filter of the project table.
 * @param {object} projects A list of projects
 */
export const ProjectOverviewComponent = {
    template: `
<div layout="column" class="project-version-detail">
    <div flex-gt-xs="100" flex-offset-gt-xs="0" class="project-version-detail-subnav">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="row" layout-align="space-between end">
            <h2 layout-margin class="title-spaceing">
                <strong>Projects</strong>
            </h2>
            <form name="filter.form">
                <md-button ng-if="$ctrl.user.isAdmin" class="md-primary md-raised" ng-click="$ctrl.openNewProjectDialog($event)">New project</md-button>
            </form>
        </div>
    </div>
    <div flex-gt-xs="100" flex-offset-gt-xs="0">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="column">
            <md-card layout="column">
                <div class="project-overview-filter" layout="row">
                    <md-autocomplete flex
                        ng-model-options="{ debounce: 500 }"
                        md-search-text-change="$ctrl.updateURL()"
                        md-search-text="$ctrl.query.q"
                        md-items="item in []"
                        placeholder="Name">
                    </md-autocomplete>
                </div>
                <div ui-view></div>
            </md-card>
        </div>
    </div>
</div>
    `,
    controller: ProjectOverviewController,
    bindings: {
        query: '<',
    },
};
