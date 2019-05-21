import './warning.style.scss';

/**
 * Represents an alert which displays warning
 */
export class WarningController { }

/**
 * Represents an alert which displays warning
 */
export const WarningDirective = () => {
    return {
        template: `
<section class="warning-alert" layout="row" layout-align="start center" layout-padding>
  <ng-md-icon icon="info"></ng-md-icon>
  <p>
    <ng-transclude></ng-transclude>
  </p>
</section>
        `,
        controller: WarningController,
        controllerAs: '',
        bindToController: true,
        restrict: 'E',
        transclude: true,
        scope: { },
    };
};
