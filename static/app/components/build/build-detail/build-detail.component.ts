import './build-detail.style.scss';

import * as toastr from 'toastr';

// tslint:disable-next-line:no-var-requires
const template = require('./build-detail.tmp.html');
import { StateService } from '@uirouter/core';
import { BuildService } from '../build.service';
import { IRepeatScope, IIntervalService } from 'angular';

/**
 * Shows a detail view of a build.
 */
class BuildDetailController {
    private build: any;
    private project: any;
    private version: any;
    private buildDurationInterval: any;
    private onBuildChange: any;
    private logger: any;

    constructor(
        private Util: any,
        private Log: any,
        private $state: StateService,
        private BuildService: BuildService,
        private Buildstate: any,
        private $scope: IRepeatScope,
        private $interval: IIntervalService,
        private Cirrina: any,
    ) { }

    /**
     * Initializes the component and sets the corresponding favicon
     */
    public $onInit() {
        this.build = this.build;
        this.project = this.project;
        this.version = this.version;
        this.Util.setFaviconbyBuildstatename(this.build.buildstate);
        this.updateBuild();
        this.$scope.$watchCollection(() => this.build, () => this.updateBuild());
        this.buildDurationInterval = this.$interval(() => this.updateBuildDuration(), 1000);

        this.onBuildChange = this.Cirrina.when(this.Cirrina.subject.BUILD, this.Cirrina.event.CHANGED);
        this.onBuildChange.then().subscribe((message) => {
            if (message.id === this.build.id) {
                this.build = message;
                this.updateBuild();
            }
        });
    }

    public $onDestroy() {
        this.logger.info('Unsubscribe from "build"-events');
        this.onBuildChange.unsubscribe();
        this.$interval.cancel(this.buildDurationInterval);
    }

    /**
     * Normalizes the build to the correct form
     */
    private updateBuild() {
        this.build.buildstateDisplayName = this.Util.unpythonifyVariable(this.build.buildstate);
        this.updateBuildDuration();
    }

    /**
     * Updates the duration of this build
     */
    private updateBuildDuration() {
        this.build.duration = this.Util.getFormattedDurationOfBuild(this.build);
        this.build.startString = this.Util.getFormattedTimestamp(this.build.startstamp);
    }

    /**
     * Goes back to the project-version builds overview or
     * if $ctrl.project and $ctrl.version is not bound,
     * goto builds-state
     */
    private gotoOverview() {
        if (this.project && this.version) {
            this.$state.go('project-version.build.overview', {
                projectId: this.project.id,
                versionId: this.version.id,
            });
        } else {
            this.$state.go('build.overview');
        }
    }

    /**
     * Removes the bound build and redirects to the project
     * version builds overview
     */
    private removeBuild() {
        this.BuildService
            .remove(this.build.id)
            .then(() => {
                toastr.success('Successfully deleted the build. Will automaticly rebuild in a second!');
                this.logger.info(`Deleted build #${this.build.id} from database`);
                this.gotoOverview();
            }, (response) => {
                toastr.error(response.message);
                this.logger.error(`Error while deleting build #${this.build.id}`, response);
            });
    }
}

/**
 * @param {Object} build The build which should get displayed
 * @param {Object} project The project which should get displayed (optional)
 * @param {Object} version The version which should get displayed (optional)
 * @param {Number} logline The logline it should jump to
 */
export const BuildDetailComponent = {
    templateUrl: template,
    controller: BuildDetailController,
    bindings: {
        build: '<',
        project: '<',
        version: '<',
        logline: '<',
    },
};
