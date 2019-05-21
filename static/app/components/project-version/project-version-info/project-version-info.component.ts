import { IComponentOptions } from 'angular';
import { ProjectVersionService } from '../project-version.service';
import './project-version-info.style.scss';
import { exec } from 'child_process';
import { StateService } from '@uirouter/core';
import { Notify } from '@molior/common/notify/notify.service';

/**
 * @ngdoc controller
 * @name moliorApp.components.project.version.detail.controller:ProjectVersionInfoController
 * @description
 * Handles the project version detail functionality.
 * This controller is used by {@link moliorApp.components.project.version.detail.directive:ProjectVersionInfo ProjectVersionInfo Component}
 *
 */
class ProjectVersionInfoController {

    public private;
    private version: any;
    private logger: any;
    private project: any;

    constructor(
        private ProjectVersionService: ProjectVersionService,
        private $state: StateService,
        private $mdToast: any,
        private Notify: Notify,
        Log: any,
    ) {
        this.logger = Log.init('ProjectVersionInfoController');
    }

    /**
     * Toggles the ci build enabled flag on the projectversion
     */
    private async toggleCiBuilds() {
        try {
            await this.ProjectVersionService.toggleCi(this.version.id);
            this.$mdToast.show(this.Notify.notify('Saved'));
        } catch (err) {
            this.version.ci_builds_enabled = !this.version.ci_builds_enabled;
            this.logger.error(err);
            this.$mdToast.show(this.Notify.notify(err.data));
        }
    }

    /**
     * Lock the projectversion and ask for confirmation
     */
    private async lock() {
        if (confirm('Are you sure? Once a projectversion is locked you can not unlock it!')) {
            try {
                await this.ProjectVersionService.lock(this.version.id);
                this.$mdToast.show(this.Notify.notify('Saved'));
                this.$state.reload();
            } catch (err) {
                this.$mdToast.show(this.Notify.notify(err.data));
            }
        }
    }

    /**
     * Delete the projectversion and ask for confirmation
     */
    private async delete() {
        if (confirm('Are you sure? Once a projectversion is deleted you can not recover your data!')) {
            try {
                await this.ProjectVersionService.delete(this.version.id);
                this.$state.go('project-detail', { projectId: this.project.id});
            } catch (err) {
                this.$mdToast.show(this.Notify.notify(err.data));
            }
        }
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.version.detail.directive:ProjectVersionInfo
 * @description
 * This component displays a version of a project.
 * This component has substates, which should be related, to the current project version.
 * @restrict 'E'
 */
export const ProjectVersionInfoComponent: IComponentOptions = {
    template: `
<md-card layout="column">
    <md-toolbar layout="row">
        <div class="md-toolbar-tools" layout="row" layout-align="space-between center">
            <span>{{ $ctrl.project.name }} / {{ $ctrl.version.name }}</span>
            <div ng-if="!$ctrl.version.is_locked">
                <md-checkbox ng-click="$ctrl.toggleCiBuilds()" class="header-checkbox" ng-model="$ctrl.version.ci_builds_enabled" aria-label="ci builds">
                    <strong>CI BUILDS</strong>
                </md-checkbox>
                <md-button ng-click="$ctrl.lock()" aria-label="Lock Projectversion" ng-click="$ctrl.lockVersion()">
                    <strong>lock</strong>
                </md-button>
                <md-button class="md-warn" ng-click="$ctrl.delete()" aria-label="Delete Projectversion">
                    <strong>delete</strong>
                </md-button>
            </div>
        </div>
    </md-toolbar>
    <md-toolbar ng-if="$ctrl.version.is_locked" class="project-version-info">
        <div class="md-toolbar-tools">
            <em>
                <strong>This version is locked!</strong>
                You can not publish anything into this version anymore.
            </em>
        </div>
    </md-toolbar>
    <md-card-content>
        <p
            class="project-description"
            ng-if="$ctrl.project.description"
            ng-bind="$ctrl.project.description"
        ></p>
        <div layout="row" layout-align="space-between center">
            <strong>Buildvariants</strong>
            <div>
                <md-button
                    ng-disabled="true"
                    ng-repeat="buildvariant in $ctrl.buildvariants.results"
                    class="md-raised md-primary"
                    aria-label="buildvariant.name"
                    ng-bind="buildvariant.name"
                ></md-button>
            </div>
        </div>
    </md-card-content>
</md-card>
<project-version-dependency
    project-version-id="$ctrl.version.id"
    dependencies="$ctrl.version.dependencies"
    apt-url="$ctrl.version.apt_url"
    basemirror-url="$ctrl.version.basemirror_url"
    is-locked="$ctrl.version.is_locked"
></project-version-dependency>
<md-card>
    <md-toolbar layout="row">
        <div class="md-toolbar-tools" layout="row" layout-align="space-between center">
            <span>Statistics</span>
        </div>
    </md-toolbar>
    <md-card-content>
        <build-chart project-version="$ctrl.version" type="week"></build-chart>
    </md-card-content>
</md-card>
<section layout="row">
    <build-count-card flex version="$ctrl.version" ui-sref="^.^.build.overview.filter({buildstate: 'successful'})" type="success"></build-count-card>
    <build-count-card flex version="$ctrl.version" ui-sref="^.^.build.overview.filter({buildstate: ['publish_failed', 'build_failed']})" type="failed"></build-count-card>
    <build-count-card flex version="$ctrl.version" ui-sref="^.^.build.overview" type="total"></build-count-card>
</section>
    `,
    controller: ProjectVersionInfoController,
    bindings: {
        version: '<',
        buildvariants: '<',
        project: '<',
    },
};
