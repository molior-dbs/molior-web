import { IComponentOptions } from 'angular';
import './project-version-info.style.scss';
import { ProjectVersionService } from '../project-version.service';
import { StateService } from '@uirouter/core';
import { element } from 'angular';

/**
 * @ngdoc controller
 * @name moliorApp.components.project.version.detail.controller:ProjectVersionDependencyController
 * @description
 * Handles the project version detail functionality.
 * This controller is used by {@link moliorApp.components.project.version.detail.directive:ProjectVersionInfo ProjectVersionDependency Component}
 *
 */
class ProjectVersionDependencyController {
    private projectVersionId: any;

    constructor(
        private ProjectVersionService: ProjectVersionService,
        private $state: StateService,
        private $mdDialog: any,
    ) {}

    public async openDialog(event) {
        await this.$mdDialog
            .show({
                template: `
                    <project-version-dependency-form project-version-id="${this.projectVersionId}">
                    <project-version-dependency-form/>
                `,
                parent: element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
            });
        this.$state.reload();
    }

    public delete(ev: any, dependencyId: number) {
        const confirm = this.$mdDialog.confirm()
            .title('Remove dependency')
            .textContent('Do you really want to remove this dependeny?')
            .ariaLabel('remove dependency')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        this.$mdDialog
            .show(confirm)
            .then(() => {
                this.ProjectVersionService.deleteDependency(this.projectVersionId, dependencyId)
                    .then(() => this.$state.reload())
                    .catch((response) => toastr.error(response.data));
            });
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
export const ProjectVersionDependencyComponent: IComponentOptions = {
    template: `
<md-card flex-order="1" layout="column">
    <md-toolbar layout="row">
        <div class="md-toolbar-tools" layout="row" layout-align="space-between center">
            <span>Dependencies</span>
            <md-button ng-if="!$ctrl.isLocked" ng-click="$ctrl.openDialog()" aria-label="Add Dependency">add dependency</md-button>
        </div>
    </md-toolbar>
    <md-list>
        <div class="no-deps" ng-if="$ctrl.dependencies.length == 0">
            <i>no dependencies</i>
        </div>
        <md-list-item ng-click="" ng-repeat="dependency in $ctrl.dependencies" class="noright">
            <a ui-sref="project-version({projectId: dependency.project.id, versionId: dependency.id})" ng-if="!dependency.project.is_mirror">
                <span ng-bind="dependency.project.name" class="ng-binding"> </span>
                <span class="project-version-detail-divider"> / </span>
                <span ng-bind="dependency.name" class="ng-binding"> </span>
                <span class="locked-info" ng-if="dependency.is_locked">
                    <i>locked</i>
                </span>
            </a>
            <span ng-if="dependency.project.is_mirror">
                <span ng-bind="dependency.project.name" class="ng-binding"> </span>
                <span class="project-version-detail-divider"> / </span>
                <span ng-bind="dependency.name" class="ng-binding"> </span>
                <span class="locked-info" ng-if="dependency.is_locked">
                    <i>locked</i>
                </span>
            </span>
            <ng-md-icon
                ng-if="!$ctrl.isLocked"
                ng-click="$ctrl.delete($event, dependency.id)"
                size="20"
                icon="delete"
                class="md-secondary"
                style="fill: rgba(0, 0, 0, 0.66);"
            ></ng-md-icon>
        </md-list-item>
    </md-list>
</md-card>
<md-card flex-order="2" layout="column">
    <md-subheader class="md-no-sticky apt-sources-header" layout="row" layout-align="space-between center">
        <strong>$ apt-sources</strong>
        <md-button class="md-icon-button" aria-label="Add Dependency">
            <ng-md-icon size="20" icon="code" style="fill: rgb(255, 255, 255);"></md-icon>
        </md-button>
    </md-subheader>
    <ul class="apt-sources" flex="80">
        <li flex layout="row" layout-align="start center">
            {{ $ctrl.basemirrorUrl}}
        </li>
        <li flex layout="row" layout-align="start center">
            {{ $ctrl.aptUrl }}
        </li>
        <li ng-repeat="dep in $ctrl.dependencies" flex layout="row" layout-align="start center">
            {{ dep.apt_url }}
        </li>
    </ul>
</md-card>
    `,
    controller: ProjectVersionDependencyController,
    bindings: {
        dependencies: '<',
        projectVersionId: '<',
        basemirrorUrl: '<',
        isLocked: '<',
        aptUrl: '<',
    },
};
