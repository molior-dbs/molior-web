import './dependency-selection.style.scss';

/**
 * This controller is used by dependency-selection
 */
export class DependencySelectionController {
  private dependencies: any;
  private onUpdate: any;

  public onChange() {
    this.onUpdate({ value: this.dependencies.filter((d) => d.selected) });
  }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.dependency.directive:dependencySelection
 * @description
 * # Dependency Selection
 * Select dependencies
 *
 *
 * @restrict 'E'
 * @example
 * <pre>
 *  <script>
 *    class Controller {
 *      dependencies = [{
 *        name: 'dependency 1',
 *        selected: true
 *      }, {
 *        name: 'dependency 2',
 *        selected: false
 *      }]
 *
 *    }
 *  </script>
 *  <dependency-selection dependencies="$ctrl.repositories" on-update="$ctrl.newDependencies = value"></dependency-selection>
 * </pre>
 */
export const DependencySelectionDirective = () => {
    return {
        bindToController: true,
        controller: DependencySelectionController,
        controllerAs: '$ctrl',
        replace: true,
        template: `
<section class="dependency-selection" flex layout="column">
  <md-autocomplete
   md-search-text="$ctrl.searchText"
   md-min-length="0"
   md-items="item in []"
   placeholder="Search dependencies"
   md-clear-button="false">
  </md-autocomplete>
  <md-list class="dependency-list" flex layout="column">
    <div ng-repeat="dependency in $ctrl.dependencies | filter: $ctrl.searchText | orderBy: 'name'" >
      <md-list-item layout-align="start start">
        <div layout="column" flex>
          <div layout="row">
            <p ng-bind="dependency.name" flex></p>
            <md-checkbox ng-disabled="$ctrl.disabled === 'true'" ng-model="dependency.selected" ng-change="$ctrl.onChange()"></md-checkbox>
          </div>
        </div>
      </md-list-item>
    </div>
    <p ng-if="!$ctrl.dependencies.length">
      None
    </p>
  </md-list>
</section>
        `,
        restrict: 'E',
        scope: {
            dependencies: '<',
            disabled: '@?',
            onUpdate: '&',
        },
    };
};
