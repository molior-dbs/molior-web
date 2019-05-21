import './repository-item.style.scss';

import { BUILDSTATE } from '../../buildstate/buildstate.constant';
import { ProjectVersionService } from '@molior/components/project-version/project-version.service';
import { StateService } from '@uirouter/core';
import { Notify } from '@molior/common/notify/notify.service';

/**
 * @ngdoc controller
 * @name moliorApp.components.repository.overview.controller:RepositoryItemController
 * @description
 * One repository item in the repository overview list
 *
 * @requires moliorApp.components.build.service:BuildService
 * @requires moliorApp.components.buildstate.constant:Buildstate
 */
export class RepositoryItemController {
    private version: any;
    private repository: any;

    constructor(
        private $q: any,
        private ProjectVersionService: ProjectVersionService,
        private $state: StateService,
        private Notify: Notify,
        private $mdToast: any,
    ) { }

    private async delete() {
        try {
            await this.ProjectVersionService
                .deleteSourceRepository(this.version.id, this.repository.id);
            this.$state.reload();
        } catch (err) {
            this.$mdToast.show(this.Notify.notify(err.data));
        }
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.repository.overview.directive:RepositoryItem
 * @description
 * The repository item.
 * @restrict 'E'
 *
 * @param {object} repository The repository to display
 * @param {object} version The project version to get the buildstate from
 * @param {object} buildvariants List of all buildvariants
 */
export const RepositoryItemDirective = () => {
    return {
        template: `
        <tr md-row class="repository-item">
            <td md-cell ui-sref="^.detail({repositoryId: $ctrl.repository.id})" >
                <strong ng-bind="$ctrl.repository.name"></strong>
                <ng-md-icon ng-if="$ctrl.repository.state == 'error'" size="16" icon="error"></ng-md-icon>
                <md-tooltip ng-if="$ctrl.repository.state == 'error'">
                    This repository can't be cloned/pulled by molior.
                </md-tooltip>
            </td>
            <td md-cell ui-sref="^.detail({repositoryId: $ctrl.repository.id})" >
                <span ng-if="!$ctrl.repository.url"><a href="{{$ctrl.repository.url}}" target="_blank" ng-bind="$ctrl.repository.url"></a></span>
                <a target="_blank" ng-click="$event.stopPropagation()" ng-if="$ctrl.repository.url !== '' && $ctrl.repository.url !== undefined" ng-href="{{::$ctrl.repository.url}}">
                    <span ng-bind="$ctrl.repository.url"></span>
                </a>
            </td>
            <td md-cell ui-sref="^.detail({repositoryId: $ctrl.repository.id})">
                <span data-ng-repeat="arch in $ctrl.repository.projectversion.architectures">{{arch}}<font ng-show="!$last">, </font></span>
            </td>
            <td>
                <ng-md-icon
                    ng-if="!$ctrl.isLocked"
                    ng-click="$ctrl.delete()"
                    size="20"
                    icon="delete"
                    class="md-secondary"
                    style="fill: rgba(0, 0, 0, 0.66);"
                ></ng-md-icon>
            </td>
        </tr>
        `,
        restrict: 'A',
        controller: RepositoryItemController,
        controllerAs: '$ctrl',
        bindToController: true,
        replace: true,
        scope: {
            repository: '<',
            version: '<',
            buildvariants: '<',
        },
    };
};
