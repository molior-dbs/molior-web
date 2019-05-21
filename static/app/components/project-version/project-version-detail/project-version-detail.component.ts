import * as angular from 'angular';
import { each, first, map, chain } from 'lodash';
import { IComponentOptions } from 'angular';

import { StateService, TransitionService, find } from '@uirouter/core';
import './project-version-detail.style.scss';
import { ProjectVersionService } from '../project-version.service';
import { BuildvariantService } from '../../buildvariant/buildvariant.service';
import { ProjectVersionCreateResponse } from '../interfaces';

/**
 * @ngdoc controller
 * @name moliorApp.components.project.version.detail.controller:ProjectVersionDetailController
 * @description
 * Handles the project version detail functionality.
 * This controller is used by {@link moliorApp.components.project.version.detail.directive:projectVersionDetail ProjectVersionDetail Component}
 *
 */
class ProjectVersionDetailController {
    public selected: number;
    public versionDialog: boolean = false;
    public project: any;

    public stateLookup = {
        'project-version.info': 0,
        'project-version.build.overview': 1,
        'project-version.repository.overview': 2,
        'project-version.repository.detail': 2,
        'project-version.userroles': 3,
    };

    constructor(
        $scope: angular.IRootScopeService,
        $document: any,
        private $state: StateService,
        private $mdDialog: any,
    ) {
        this.selected = this.getCurrentNavigationIndex($state.$current.name);

        // FIXME: handle outside click better?
        $document.on('click', (event) => {
            const blacklist = [
                document.getElementById('version-chooser'),
                document.getElementById('version-searcher'),
                document.getElementById('toggle-icon'),
                document.getElementById('project-versions-filter-inner'),
                document.getElementById('project-versions-filter'),
            ];

            const findElement = (element) => {
                if (!element.parentElement) {
                    if (element.nodeName === 'svg') {
                        // clicked on the toggle icon ...
                        return true;
                    }
                    // root element, blacklist not found
                    return false;
                } else {
                    if (blacklist.indexOf(element) > -1) {
                        // element found, keep showing the chooser
                        return true;
                    } else {
                        // element not found, but maybe its the parent?
                        return findElement(element.parentElement);
                    }
                }
            };

            this.versionDialog = findElement(event.target);
            $scope.$apply();
        });
    }

    public openOverlayDialog(event: any) {
        this.openDialog(event, 'overlay');
    }

    public openCopyDialog(event: any) {
        this.openDialog(event, 'copy');
    }

    private openDialog(event: any, type: string) {
        const $ctrl = this;
        this.$mdDialog
            .show({
                template: `
                <project-version-copy
                    on-save="$ctrl.onProjectVersionCreated(value)"
                    project-version-id="$ctrl.version.id"
                    action="${type}"
                >
                </project-version-copy>
                `,
                parent: angular.element(document.body),
                targetEvent: event,
                controller: () => $ctrl,
                bindToController: true,
                controllerAs: '$ctrl',
                clickOutsideToClose: true,
            });
    }

    private onProjectVersionCreated(version: ProjectVersionCreateResponse) {
        this.$mdDialog.hide();
        this.$state.go(this.$state.current, {
            projectId: this.project.id,
            versionId: version.id,
        });
    }

    private searchVersions() {
        this.versionDialog = !this.versionDialog;
    }

    private getCurrentNavigationIndex(stateName: string) {
        const state = Object.keys(this.stateLookup)
            .find((state) => stateName.startsWith(state));
        return this.stateLookup[state];
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.version.detail.directive:projectVersionDetail
 * @description
 * This component displays a version of a project.
 * This component has substates, which should be related, to the current project version.
 * @restrict 'E'
 *
 * @param {Object} project The project, which should get displayed.
 * @param {Object} version The projectversion, which should get displayed. Depends on your given project
 * @param {Object} user The current user.
 * @param {Object} role The current role. Depends on the given user.
 */
export const ProjectVersionDetailComponent: IComponentOptions = {
    template: `
<div layout="column" class="project-version-detail">
    <div flex-gt-xs="100" flex-offset-gt-xs="0" class="project-version-detail-subnav">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="column">
            <h2 layout-margin class="title-spaceing">
                <a ui-sref="project-detail({ projectId: $ctrl.project.id })">
                    <strong ng-bind="$ctrl.project.name"></strong>
                </a>
                <span class="project-version-detail-divider"> / </span>
                    <md-button id="version-searcher" class="md-raised" ng-click="$ctrl.searchVersions()">
                        <div layout="row">
                            <h2 ng-bind="$ctrl.version.name"></h2>
                            <ng-md-icon
                                ng-click="$ctrl.delete(dependency.id)"
                                size="20"
                                icon="keyboard_arrow_down"
                                class="md-secondary"
                                style="
                                    fill: rgba(0, 0, 0, 0.66);
                                    margin-top: 8px;
                                    height: 10px;
                                    margin-left: 6px;
                                "
                            ></ng-md-icon>
                        </div>
                    </md-button>
                </span>
                <md-button class="header-primary-action md-raised md-primary" ng-click="$ctrl.openOverlayDialog($event)">
                    Create overlay
                </md-button>
                <md-button class="header-primary-action md-raised md-primary" ng-click="$ctrl.openCopyDialog($event)">
                    Copy version
                </md-button>
            </h2>
            <md-tabs md-selected="$ctrl.selected">
                <md-tab ui-sref="project-version.info" active>
                    Info
                </md-tab>
                <md-tab ui-sref="project-version.build.overview">
                    Builds
                </md-tab>
                <md-tab ui-sref="project-version.repository.overview">
                    Repositories
                </md-tab>
                <md-tab ui-sref="project-version.userroles">
                    Admin
                </md-tab>
            </md-tabs>
        </div>
    </div>
    <div flex-gt-xs="100" flex-offset-gt-xs="0">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="column">
            <div ui-view class="project-version-detail-view"></div>
        </div>
    </div>
    <project-versions
        id="version-chooser"
        small="true"
        project="$ctrl.project"
        ng-if="$ctrl.versionDialog"
    ></project-versions>
</div>
    `,
    controller: ProjectVersionDetailController,
    bindings: {
        project: '<',
        version: '<',
        user: '<',
        role: '<',
    },
};
