import * as toastr from 'toastr';
import { Util } from '@molior/app.util';
import { BuildService } from '@molior/components/build/build.service';
import { RepositoryService } from '../repository.service';
import { IRootScopeService } from 'angular';

/**
 * Show detail information of a repository
 */
export class RepositoryDetailInformationController {
    private repository: any;
    private buildvariants: any;
    private latestBuilds: any[];
    private version: any;
    private projectversion: any;

    constructor(
        private Util: Util,
        private BuildService: BuildService,
        private RepositoryService: RepositoryService,
        private $q: any,
        private $scope: IRootScopeService,
        private $mdDialog: any,
    ) { }

    /**
     * Lodas the nessesary data
     */
    public $onInit() {
        this.projectversion = this.repository
            .projectversions
            .find((version) => version.id === this.version.id);
        this.$scope.$watch('$ctrl.buildvariants', () => this.loadLatestBuilds());
    }

    /**
     * Loads the latest builds of this repository
     */
    public loadLatestBuilds() {
        if (!this.buildvariants) {
            return;
        }
        this.latestBuilds = [];
        (this.buildvariants.results || []).forEach((buildvariant) =>
            this.getLatestBuild(buildvariant.id).then((build) =>
                this.latestBuilds.push(build),
            ),
        );
    }

    /**
     * Triggers a build
     * <pre>
     *    $ctrl.build(ev);
     * </pre>
     */
    public build(ev) {
        const confirm = this.$mdDialog.confirm()
            .title('Trigger Build ' + this.repository.name)
            .textContent('Do you want to manually trigger a build latest job for this repository?')
            .ariaLabel('build repository')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        this.$mdDialog
            .show(confirm)
            .then(() => {
                this.RepositoryService.build(this.repository.id)
                    .then(
                        (result) => toastr.success(result),
                        (result) => toastr.error(result),
                    );
            });
    }

    /**
     * Retriggers clone of the repository
     *
     * @example
     * <pre>
     *    $ctrl.reclone(ev);
     * </pre>
     *
     */
    public reclone(ev) {
        const confirm = this.$mdDialog.confirm()
            .title('Reclone ' + this.repository.name)
            .textContent('Do you want to reclone the repository?')
            .ariaLabel('reclone repository')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        this.$mdDialog
            .show(confirm)
            .then(() => {
                this.RepositoryService.clone(this.repository.id)
                    .then(
                        (result) => toastr.success(result),
                        (result) => toastr.error(result),
                    );
            });
    }

    /**
     * Returns the latest build of the given buildvariant
     * @param {Number} buildvariantId The buildvariant you want to have the last build of
     * @returns {Promise<object>} Promise with the last build
     */
    public getLatestBuild(buildvariantId) {
        const deferred = this.$q.defer();
        const options: any = { sourcerepository_id: this.repository.id, per_page: 1 };
        if (this.version) {
            options.project_version_id = this.version.id;
        }
        if (buildvariantId) {
            options.buildvariant_id = buildvariantId;
        }
        this.BuildService
            .all(options)
            .then((builds) => {
                if (builds.results.length) {
                    deferred.resolve(builds.results[0]);
                } else {
                    deferred.reject();
                }
            })
            .catch(deferred.reject);
        return deferred.promise;
    }
}

/**
 * Show detail information of a repository
 */
export const RepositoryDetailInformationComponent = {
    template: `
<md-card flex class="repository-detail-information animate-in" layout-padding>
    <div layout="row">
        <label flex="30" layout-align="right center">Name</label>
        <span flex="80" ng-bind="$ctrl.repository.name"></span>
    </div>
    <div layout="row">
        <label flex="30" layout-align="right center">State</label>
        <div>
            <md-button style="margin: 0" ng-click="$ctrl.reclone($event)" ng-if="$ctrl.repository.state == 'error'" class="md-icon-button">
                <ng-md-icon size="16" icon="error"></ng-md-icon>
            </md-button>
            <md-tooltip ng-if="$ctrl.repository.state == 'error'">
                Click to reclone
            </md-tooltip>
            <ng-md-icon ng-if="$ctrl.repository.state != 'error'" size="16" icon="check_circle"></ng-md-icon>
            <span style="text-transform: capitalize;" ng-bind="$ctrl.repository.state"></span>
        </div>
    </div>
    <div layout="row">
        <label flex="30" layout-align="right center">URL</label>
        <a target="_blank">
            <span ng-bind="$ctrl.repository.url"></span>
        </a>
    </div>
    <div layout="row">
        <label flex="30" layout-align="right center">Architectures</label>
        <div flex="80">
            <span data-ng-repeat="arch in $ctrl.projectversion.architectures">{{arch}}<font ng-show="!$last">, </font></span>
        </div>
    </div>
    <div layout="row">
        <div flex="30" layout-align"right center">
            <label>Latest Builds</label>
            <md-button style="margin: 0" ng-click="$ctrl.build($event)" ng-if="$ctrl.repository.state != 'error'" class="md-icon-button">
                <ng-md-icon size="16" icon="replay"></ng-md-icon>
            </md-button>
        </div>
        <div flex="80" layout="column">
            <div ng-repeat="build in $ctrl.latestBuilds" layout="row" flex class="latest-build" ng-if="$ctrl.latestBuilds.length">
                <buildstate status="build.buildstate" size="18"></buildstate>
                <a ui-sref="^.^.build.detail({buildId: build.id})">
                    <span ng-bind="build.sourcename"></span>
                    (<span ng-bind="build.version"></span>)
                    <span ng-bind="build.buildvariant.name"></span>
                </a>
            </div>
            <div flex ng-if="!$ctrl.latestBuilds.length">-</div>
        </div>
    </div>
</md-card>
    `,
    controller: RepositoryDetailInformationController,
    bindings: {
        repository: '<',
        version: '<',
        buildvariants: '<',
    },
};
