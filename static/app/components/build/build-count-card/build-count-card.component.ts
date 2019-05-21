import { BuildService } from '../build.service';
import { MoliorApiResponse } from '@molior/core';
import { BuildOverviewItem } from '../interfaces';

/**
 * @ngdoc controller
 * @name moliorApp.components.build.count-card.controller:RepositoryBuildCountCard
 * @description
 * Displays a card with the total built amount
 *
 */
export class BuildCountCardController {
    private type: any;
    private class: string;
    private text: string;
    private icon: string;
    private buildstate: any;
    private repository: any;
    private version: any;
    private builds: MoliorApiResponse<BuildOverviewItem[]>;

    constructor(
        private BuildService: BuildService,
        private Buildstate: any) { }

    public $onInit() {
        this.type = this.type.toLowerCase();
        this.setTypeProperties(this.type);
        this.load();
    }

    private setTypeProperties(type) {
        switch (type) {
        case 'success':
            this.class = 'card-stats-success';
            this.text = 'Succeeded Builds';
            this.icon = 'done';
            this.buildstate = this.Buildstate.SUCCESSFUL;
            break;
        case 'failed':
            this.class = 'card-stats-failed';
            this.text = 'Failed Builds';
            this.icon = 'error';
            this.buildstate = [this.Buildstate.BUILD_FAILED, this.Buildstate.PUBLISH_FAILED];
            break;
        case 'total':
            this.class = 'card-stats-total';
            this.icon = 'equalizer';
            this.text = 'Total Builds';
            break;
        }
    }

    private load() {
        const options: any = { count_only: true };

        if (this.repository) {
            options.sourcerepository_id = this.repository.id;
        }

        // Also filter for project version, if it is given
        if (this.version) {
            options.project_version_id = this.version.id;
        }

        if (this.buildstate) {
            options.buildstate = this.buildstate;
        }

        return this.BuildService
            .all(options)
            .then((builds) => this.builds = builds);
    }
}

/**
 * Displays a card with the total built amount
 *
 * @param {object} repository The repository to get the build count
 * @param {object?} version The projectversion
 * @param {string} type The type of the card. Either success, failed or total
 */
export const BuildCountCardComponent = {
    template: `
<md-card ng-class="$ctrl.class" class="card-stats" layout="column" layout-align="center start" flex>
    <strong class="card-stats-number" ng-bind="$ctrl.builds.total_result_count"></strong>
    <span ng-bind="::$ctrl.text"></span>
    <ng-md-icon icon="{{$ctrl.icon}}" size="220"></ng-md-icon>
</md-card>
    `,
    controller: BuildCountCardController,
    bindings: {
        repository: '<',
        version: '<',
        type: '@',
    },
};
