/**
 * @ngdoc controller
 * @name moliorApp.components.repository.form.controller:RepositoryConfirmationController
 * @description
 * Represents the confirmation screen for the repository form
 *
 * @requires moliorApp.log.service:Log
 */
export class RepositoryConfirmationController {
    private repository: any;
    constructor(
        private Util: any,
        private $scope: angular.IRootScopeService,
    ) { }

    public $onInit() {
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.repository.form.directive:repositoryConfirmation
 * @description
 * Represents the confirmation screen for the repository form
 * @restrict 'E'
 *
 */
export const RepositoryConfirmationComponent = {
    template: `
<section layout="column">
    <h3>Confirmation</h3>
    <section layout-padding>
        <div layout="row">
            <span>URL:&nbsp;</span>
            <a href="{{ $ctrl.repository.url }}" target="_blank" ng-if="$ctrl.repository.url">
            <strong ng-bind="$ctrl.repository.url"></strong>
            <md-tooltip>
                <md-icon class="bitbucket-logo" md-svg-src="assets/img/bitbucket-logo.svg" aria-label="Bitbucket Logo"></md-icon> Open in Bitbucket
            </md-tooltip>
            </a>
            <strong ng-if="!$ctrl.repository.url" ng-bind="$ctrl.repository.url"></strong>
        </div>
        <div layout="row">
            <span>Buildoptions:&nbsp;</span>
            <buildvariant-picker disabled ng-model="$ctrl.repository.buildvariants" ng-if="$ctrl.repository.buildvariants.length > 0" allowed-build-options="$ctrl.repository.buildvariants"
            ng-basemirrors="$ctrl.basemirrors" ng-architectures="$ctrl.architectures"></buildvariant-picker>
        </div>
    </section>
</section>
    `,
    controller: RepositoryConfirmationController,
    bindings: {
        repository: '<',
        architectures: '<',
        basemirrors: '<',
    },
};
