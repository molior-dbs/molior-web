import * as toastr from 'toastr';

import { StateService } from '@uirouter/core';
import { IIntervalService, IPromise, IScope } from 'angular';
import { BuildService } from '../build.service';
import { BuildOverviewItem } from '../interfaces';

/**
 * @ngdoc controller
 * @name moliorApp.components.build.overview.controller:BuildItemController
 * @description
 * Represents one build item
 *
 * @requires moliorApp.build.service:BuildService
 * @requires $state
 * @requires moliorApp.util.service:Util
 * @requires moliorApp.log.service:Log
 * @requires $interval
 */
class BuildItemController {
    private logger: any;
    private build: BuildOverviewItem | any;
    private onBuildRemove;
    private buildDurationInterval: IPromise<any>;
    constructor(
        private BuildService: BuildService,
        private $state: StateService,
        private Util,
        Log,
        private $interval: IIntervalService,
        private $scope: IScope) {
        this.$state = $state;
        this.Util = Util;
        this.$interval = $interval;
        this.logger = Log.init('BuildItemController');
        this.$scope = $scope;
        this.BuildService = BuildService;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildItemController#$onInit
     * @methodOf moliorApp.components.build.overview.controller:BuildItemController
     *
     * @description
     * Initializes this build item
     *
     * @memberof BuildItemController
     */
    public $onInit() {
        this.build = this.build;
        this.onBuildRemove = this.onBuildRemove;
        this.updateBuild();
        this.$scope.$watchCollection(() => this.build, () => this.updateBuild());
        this.buildDurationInterval = this.$interval(() => this.updateBuildDuration(), 1000);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildItemController#updateBuild
     * @methodOf moliorApp.components.build.overview.controller:BuildItemController
     *
     * @description
     * Normalizes the build to the correct form
     * @memberof BuildItemController
     */
    public updateBuild() {
        this.updateBuildDuration();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildItemController#$onDestroy
     * @methodOf moliorApp.components.build.overview.controller:BuildItemController
     *
     * @description
     * Clears the subscribtions from this directive
     *
     * @memberof BuildItemController
     */
    public $onDestroy() {
        this.$interval.cancel(this.buildDurationInterval);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildItemController#updateBuildDuration
     * @methodOf moliorApp.components.build.overview.controller:BuildItemController
     *
     * @description
     * Updates the duration of this build
     *
     * @memberof BuildItemController
     */
    public updateBuildDuration() {
        this.build.duration = this.Util.getFormattedDurationOfBuild(this.build);
        this.build.startString = this.Util.getFormattedTimestamp(this.build.startstamp);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildItemController#removeBuild
     * @methodOf moliorApp.components.build.overview.controller:BuildItemController
     *
     * @description
     * Removes the given build.
     *
     */
    public removeBuild() {
        this.BuildService.remove(this.build.id).then(() => {
            toastr.success('Successfully deleted the build. Will rebuild in a second!');
            this.logger.info(`Deleted build ${this.build.id} from database`);
            this.onBuildRemove({
                build: this.build,
            });
        }, (response) => {
            toastr.error(response.message);
            this.logger.error('Error while deleting build #' + this.build.id, response);
        });
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildItemController#openBuildDetailMenu
     * @methodOf moliorApp.components.build.overview.controller:BuildItemController
     *
     * @description
     * Opens the build detail menu
     *
     * @param {Object} $mdOpenMenu The injected $mdOpenMenu parameter
     * @param {Event} $event The click-$event
     */
    public openBuildDetailMenu($mdOpenMenu, $event) {
        $event.stopPropagation();
        $mdOpenMenu($event);
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.build.overview.directive:buildItem
 * @description
 * # build-item Directive
 *  Represents one build item in the {@link moliorApp.components.build.overview.directive:buildOverview Build Overview} table.
 *
 * @restrict 'A'
 *
 * @param {Build} build The build to represent
 * @param {Function} onBuildRemove Gets called when the build gets removed. Sends `index` as a parameter.
 * @param {Boolean} hideProjectField If the project field should be hidden
 */
export const BuildItemDirective = () => {
    return {
        template: `
<tr>
    <td md-cell class="small-filter">
        <div>
            <buildstate status="$ctrl.build.buildstate"></buildstate>
        </div>
    </td>
    <td md-cell>
        <div layout="row" ng-switch="$ctrl.build.buildtype">
            <span ng-switch-when="source">
                <strong>{{$ctrl.build.sourcename}}</strong>
                &nbsp;[source]
            </span>
            <span ng-switch-when="mirror">
                <strong>{{$ctrl.build.sourcename}} / {{$ctrl.build.version}}</strong>
                &nbsp;[mirror]
            </span>
            <span ng-switch-when="debootstrap">
                <strong>{{$ctrl.build.sourcename}} / {{$ctrl.build.version}}</strong>
                &nbsp;[debootstrap]
            </span>
            <span ng-switch-when="chroot">
                <strong>{{$ctrl.build.sourcename}} / {{$ctrl.build.version}}</strong>
                &nbsp;[chroot]
            </span>
            <span ng-switch-default>
                <strong>{{$ctrl.build.sourcename}}</strong>
            </span>
        </div>
        <div layout="row" ng-if="$ctrl.build.buildtype == 'source' || $ctrl.build.buildtype == 'deb'">
            <span>{{$ctrl.build.version}}</span>
        </div>
    </td>
    <td md-cell class="small-filter">
        <span ng-bind="$ctrl.build.buildvariant.name"></span>
    </td>
    <td md-cell ng-if="!$ctrl.hideProjectField">
        <a ng-if="$ctrl.build.project.name && $ctrl.build.project.version.name" ng-click="$event.stopPropagation()" ui-sref="project-version.info({projectId: $ctrl.build.project.id, versionId: $ctrl.build.project.version.id})">
            <span ng-bind="$ctrl.build.project.name"></span>
            <span class="project-version-seperator">/</span>
            <span class="project-version-name" ng-bind="$ctrl.build.project.version.name"></span>
        </a>
    </td>
    <td md-cell class="small-filter"><span ng-bind="$ctrl.build.maintainer"></span><md-tooltip ng-if="$ctrl.build.maintainer_email">{{$ctrl.build.maintainer_email}}</md-tooltip></td>
    <td md-cell class="small-filter">
        <a ng-if="!$ctrl.build.branch && $ctrl.build.git_ref" ng-click="$event.stopPropagation()" ng-href="{{$ctrl.build.commit_url}}" target="_blank">
            <span>{{$ctrl.build.git_ref | limitTo : 11}}</span>
        </a>
        <a ng-if="$ctrl.build.branch" ng-click="$event.stopPropagation()" ng-href="{{$ctrl.build.commit_url}}" target="_blank">
            <span>{{$ctrl.build.branch | limitTo : 20}}</span>
        </a>
        <md-tooltip ng-if="$ctrl.build.git_ref">View commit</md-tooltip>
        <span ng-if="!$ctrl.build.git_ref"></span>
    </td>
    <td md-cell class="small-filter">
        <div flex layout="row" layout-align="left center">
            <ng-md-icon class="build-icon" size="14" icon="today"></ng-md-icon>
            <span> {{$ctrl.build.startString || 'n/a'}}</span>
            <md-tooltip>{{$ctrl.build.startstamp || 'n/a'}}</md-tooltip>
        </div>
        <div layout="row">
            <ng-md-icon class="build-icon" size="14" icon="timer"></ng-md-icon>
            <span> {{$ctrl.build.duration || 'n/a' }}</span>
        </div>
    </td>
    <td md-cell class="more-cell">
        <md-menu md-position-mode="target-right target">
            <md-button aria-label="Open demo menu" class="md-icon-button" ng-click="$ctrl.openBuildDetailMenu($mdOpenMenu, $event)">
                <ng-md-icon class="build-more" md-menu-origin icon="more_vert"></ng-md-icon>
            </md-button>
            <md-menu-content width="4">
                <md-menu-item>
                    <md-button href="/buildout/{{$ctrl.build.id}}/build.log" target="_blank">
                        <div layout="row" layout-align="start center" flex>
                            <p flex>Open Raw Log</p>
                            <ng-md-icon icon="sort"></ng-md-icon>
                        </div>
                    </md-button>
                </md-menu-item>
                <md-menu-divider></md-menu-divider>
                <md-menu-item>
                    <md-button ng-disabled="!$ctrl.build.can_rebuild" ng-click="$ctrl.removeBuild()">
                        <div layout="row" layout-align="start center" flex>
                            <p flex>Rebuild</p>
                            <ng-md-icon icon="refresh"></ng-md-icon>
                        </div>
                    </md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    </td>
</tr>   `,
        restrict: 'A',
        controller: BuildItemController,
        controllerAs: '$ctrl',
        bindToController: true,
        replace: true,
        scope: {
            build: '=',
            onBuildRemove: '&',
            hideProjectField: '<',
        },
    };
};
