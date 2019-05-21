import './information.style.scss';

/**
 * Represents an alert which displays information
 */
export class InformationController {
}

/**
 * Represents an alert which displays information
 */
export const InformationDirective = () => {
    return {
        template: `
<section class="information-alert" layout="row" layout-align="start center" layout-padding>
  <ng-md-icon icon="info"></ng-md-icon>
  <p>
    <ng-transclude></ng-transclude>
  </p>
</section>
        `,
        controller: InformationController,
        controllerAs: '',
        bindToController: true,
        restrict: 'E',
        transclude: true,
        scope: { },
    };
};
