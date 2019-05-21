import './error.style.scss';

/**
 * Represents an alert which displays error
 */
export class ErrorController { }

/**
 * @ngdoc directive
 * @name moliorApp.components.shared.directive:error
 * @description
 * Represents an alert which displays error
 * @restrict 'E'
 *
 */
export const ErrorDirective = () => {
    return {
        template: `
<section class="error-alert" layout="row" layout-align="start center" layout-padding>
  <ng-md-icon icon="error"></ng-md-icon>
  <p>
    <ng-transclude></ng-transclude>
  </p>
</section>
        `,
        controller: ErrorController,
        controllerAs: '',
        bindToController: true,
        restrict: 'E',
        transclude: true,
        scope: { },
    };
};
