import './build-overview.style.scss';

import { StateService } from '@uirouter/angularjs';
import { copy, IRootScopeService } from 'angular';
import { BuildService } from '../build.service';

import { MoliorApiResponse } from '@molior/core';
import { keys } from 'lodash';
import { BuildOverviewItem, BuildOverviewQuery } from '../interfaces';

// tslint:disable-next-line:no-var-requires
const template = require('./build-overview.tmp.html');

/**
 * @ngdoc controller
 * @name moliorApp.components.build.overview.controller:BuildOverviewController
 * @description
 * Represents an overview of builds
 *
 * @requires $q
 * @requires $mdDialog
 * @requires $scope
 * @requires moliorApp.util.service:Util
 * @requires $state
 * @requires moliorApp.log.service:Log
 * @requires moliorApp.build.service:BuildService
 * @requires molior.core.cirrina.service:Cirrina
 */
class BuildOverviewController {
    private logger: any;
    private currentlyFailing: any;
    private projectVersionId: number;
    private filters: any = {};
    private page: number = 1;
    private pageSize: number = 20;
    private isLoading: boolean;
    private from: any;
    private onBuildAdd: any;
    private onBuildChange: any;
    private builds: MoliorApiResponse<BuildOverviewItem[]>;
    private projectId: number;

    constructor(
        private $scope: IRootScopeService,
        private Util,
        private $state: StateService,
        private BuildService: BuildService,
        private Cirrina,
        Log,
    ) {
        this.logger = Log.init('BuildOverviewComponent');
        // Workaround. See https://github.com/daniel-nagy/md-data-table/issues/579
    }
    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#$onInit
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Initializes the component.
     * Starts listening to build websocket events
     *
     */
    public $onInit() {
        this.isLoading = true;

        this.page = this.page || 1;
        this.pageSize = this.pageSize || 20;
        this.projectVersionId = this.projectVersionId;
        this.projectId = this.projectId;
        this.filters = this.filters || {};

        this.$scope.$watchCollection(() => [this.page, this.pageSize], () => this.updateURL());

        if (this.projectVersionId !== undefined && !isNaN(this.projectVersionId)) {
            this.projectVersionId = this.projectVersionId;
        }

        this.logger.info('Subscribe to "build"-events');
        this.onBuildAdd = this.Cirrina.when(this.Cirrina.subject.BUILD, this.Cirrina.event.ADDED);
        this.onBuildAdd.then().subscribe((message) => this.addBuild(message));

        this.onBuildChange = this.Cirrina.when(this.Cirrina.subject.BUILD, this.Cirrina.event.CHANGED);
        this.onBuildChange.then().subscribe((message) => this.updateBuild(message));

        this.loadBuilds();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#getBuildByIdFromLocal
     * @description
     * Returns the build with the given id from the current loaded build
     * list.
     *
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @param {Number} id The id of the build you want to have
     *
     * @returns {Object} The build with the given id
     */
    public getBuildByIdFromLocal(id) {
        return this.builds.results.find((build) => build.id === id);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#updateBuild
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Updates the given build in the UI, if it exists
     *
     * @param {Object} build The build to update
     */
    public updateBuild(build) {
        // FIXME: Workaround for bug where no build added event is received
        if (this.getBuildByIdFromLocal(build.id) === undefined) {
            this.loadBuilds();
            return;
        }

        const serverBuild = this.Util.normalizeBuild(build);
        // Copy values from the serverBuild to the localBuild
        keys(serverBuild).forEach((key) => this.getBuildByIdFromLocal(build.id)[key] = serverBuild[key]);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#addBuild
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Adds the given build to the ui, if it fits with the filters
     *
     * @param {Object} build The build to add
     */
    public addBuild(build) {
        if (this.projectVersionId === undefined ||
            build.projectversion_id === this.projectVersionId) {
            this.logger.info('New build received:');
            this.loadBuilds();
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#getMoliorServiceBuildOptions
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Returns the options-object for BuildService.all method,
     * depending on filters of the overview
     *
     * @memberof BuildOverviewController
     *
     */
    public getMoliorServiceBuildOptions() {
        const filters = copy(this.filters);

        let options = {
            page: this.page > 0 ? this.page - 1 : undefined,
            per_page: this.pageSize,
            currently_failing: this.currentlyFailing,
            from: this.from,
        };
        options = Object.assign(options, filters);

        if (this.projectVersionId) {
            (options as any).project_version_id = this.projectVersionId;
        }
        return options;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#load
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Loads the builds with the applied filters.
     *
     * @example
     * <pre>
     *    $ctrl.filters = {
     *        "architecture": "a",
     *        "version": "1."
     *  }
     *    $ctrl.load();
     * </pre>
     */
    public loadBuilds() {
        const options = this.getMoliorServiceBuildOptions();

        this.logger.info('Loading Builds..', options);

        // FIXME: Correct type for options, not just "as ..."
        this.BuildService.all(options as BuildOverviewQuery)
            .then((data) => {
                this.logger.info('Received Builds!', data);
                this.builds = data;
                this.isLoading = false;
            }, (response) => {
                this.logger.error('Failed receiving builds!', response);
                this.isLoading = false;
            })
            .then(() => this.$scope.$apply());
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#updateURL
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Updates the URL, depending on the bound filters
     */
    public updateURL() {
        this.$state.transitionTo(this.$state.current, {
            sourcrepository: this.filters.sourcerepository,
            version: this.filters.version,
            maintainer: this.filters.maintainer,
            startstamp: this.filters.startstamp,
            buildstate: this.filters.buildstate,
            buildvariant: this.filters.buildvariant,
            sourcerepository_id: this.filters.sourcerepository_id,
            currentlyFailing: this.currentlyFailing,
            page: this.page,
        }, {
                inherit: true,
                relative: this.$state.$current,
                notify: false,
                reload: false,
                location: 'replace',
        });
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#removeLocalBuild
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Removes the given index from the builld list
     *
     * @param {Number} index The index of the given build
     */
    public removeLocalBuild(index) {
        this.builds.results.splice(index, 1);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#openBuild
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * If the projectId and the projectVersionId of the controller
     * is set, it will redirect to the build page of the given build
     * and displays the current project version name.
     *
     * Otherwise it won't display the project version name.
     *
     * @param {Object} build The build to open
     *
     * @example
     * <pre>
     *  $ctrl.openBuild({id: 1});
     * </pre>
     */
    public openBuild(build) {
        const buildId = build.id;
        if (this.projectId && this.projectVersionId) {
            this.$state.go('^.detail', {
                buildId,
                projectId: this.projectId,
                versionId: this.projectVersionId,
            });
        } else {
            this.$state.go('^.detail', { buildId });
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.build.overview.controller:BuildOverviewController#$onDestroy
     * @methodOf moliorApp.components.build.overview.controller:BuildOverviewController
     *
     * @description
     * Destroys the component.
     * Stops listening to build websocket events
     *
     */
    public $onDestroy() {
        this.logger.info('Unsubscribe from "build"-events');
        this.onBuildChange.unsubscribe();
        this.onBuildAdd.unsubscribe();
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.build.overview.directive:buildOverview
 * @description
 * An overview of builds. It is adjustable to show all builds or just builds of the given
 * projectVersionId and projectId.
 *
 * @restrict 'E'
 * @param {Number} projectVersionId The id of the project version. Shows all, when undefined. (optional)
 * @param {Number} projectId The id of project. Shows all, when undefined. (optional)
 * @param {Object} filters The filters which should be preset. (optional)
 * @param {Number} page The page the table should be. Default 1. (optional)
 * @param {Number} from Date which the build should show from (optional)
 * @param {Boolean} currentlyFailing If should display only builds, which are currently failing
 * @param {Number} pageSize The size of the page (optional)
 * @param {Object[]} buildstates Array of all possible buildstates
 */
export const BuildOverviewComponent = {
    templateUrl: template,
    controller: BuildOverviewController,
    bindings: {
        projectVersionId: '<',
        version: '<',
        projectId: '<',
        filters: '<',
        page: '<',
        from: '<',
        pageSize: '<',
        currentlyFailing: '<',
        buildstates: '<',
    },
};
