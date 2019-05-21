import * as angular from 'angular';
import { ProjectDetail, Version } from '../interfaces';
import { ProjectVersionCreateResponse } from '@molior/components/project-version/interfaces';
import { StateService } from '@uirouter/core';

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
class ProjectDetailController {
    private query: string;
    private project: ProjectDetail;
    private versions: Version[];

    constructor(
        private $mdDialog: any,
        private $state: StateService,
    ) { }

    public openNewProjectVersionDialog(event: any) {
        this.$mdDialog
            .show({
                template: `<project-version-form
                    project-id="${this.project.id}"
                    on-save="$ctrl.onSave()">
                </project-version-form>`,
                parent: angular.element(document.body),
                controller: () => {
                    return {
                        onSave: () => {
                            this.$state.reload();
                        },
                    };
                },
                bindToController: true,
                controllerAs: '$ctrl',
                targetEvent: event,
                clickOutsideToClose: false,
            });
    }

    public $onInit() {
        this.versions = this.project.versions;
    }

    public search() {
        if (!this.query) {
            this.versions = this.project.versions;
        } else {
            this.versions = this.project.versions
                .filter((version) => version.name.includes(this.query));
        }
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
export const ProjectDetailComponent = {
    template: `
<div layout="column" class="project-version-detail">
    <div flex-gt-xs="100" flex-offset-gt-xs="0" class="project-version-detail-subnav">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="row" layout-align="space-between end">
            <h2 layout-margin class="title-spaceing">
                <strong ng-bind="$ctrl.project.name"></strong>
            </h2>
            <form name="filter.form">
                <md-button class="md-primary md-raised molior-header-button" ng-click="$ctrl.openNewProjectVersionDialog($event)">New projectversion</md-button>
            </form>
        </div>
    </div>
    <div flex-gt-xs="100" flex-offset-gt-xs="0">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="column">
            <project-versions project="$ctrl.project"></project-versions>
        </div>
    </div>
</div>
    `,
    controller: ProjectDetailController,
    bindings: {
        project: '<',
    },
};
