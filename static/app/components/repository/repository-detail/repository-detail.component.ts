import './repository-detail.style.scss';
import * as toastr from 'toastr';
import { StateService } from '@uirouter/core';

/**
 * A more detailed component for a repository.
 */
export class RepositoryDetailController {
    private selectedTab: any;

    constructor(
        private $scope: angular.IRootScopeService,
        private $state: StateService,
    ) { }

    public $onInit() {
        this.$scope.$watch(() => this.selectedTab, () => {
            switch (this.selectedTab) {
            case 0:
                this.$state.go('^.information');
                break;
            case 1:
                this.$state.go('^.webhook');
                break;
            case 2:
                this.$state.go('^.stats');
                break;
            }
        });
    }
}

/**
 * A more detailed component for a repository.
 * @param {Object} repository The sourcerepository to represent
 * @param {Object} version The projectversion
 * @param {Object} buildvariants All buildvariants, which buildstate should get displayed
 */
export const RepositoryDetailComponent = {
    template: `
<section class="repository-detail" flex layout="column">
    <main layout="column" flex>
        <div class="layout-margin" layout="row" flex layout-align="start center">
            <h3>Repository Information</h3>
        </div>
        <repository-detail-information
            repository="$ctrl.repository"
            version="$ctrl.version"
            buildvariants="$ctrl.buildvariants"
        ></repository-detail-information>
        <repository-detail-stats repository="$ctrl.repository" version="$ctrl.version"></repository-detail-stats>
        <section>
            <div class="layout-margin" layout="row" flex layout-align="space-between center">
                <h3>Webhooks</h3>
                <add-repository-hook repository="$ctrl.repository"></add-repository-hook>
            </div>
            <hook-overview hooks="$ctrl.repository.hooks"></hook-overview>
        </section>
    </main>
</section>
    `,
    controller: RepositoryDetailController,
    bindings: {
        repository: '<',
        version: '<',
        buildvariants: '<',
        selectedTab: '<',
    },
};
