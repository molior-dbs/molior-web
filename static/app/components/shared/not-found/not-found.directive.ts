import './not-found.style.scss';

/**
 * This directive gets displayed when nothing is found
 */
export class NotFoundController { }

/**
 * This directive gets displayed when nothing is found
 */
export const NotFoundDirective = () => {
    return {
        template: `
        <section class="not-found" layout="column">
            <div class="not-found-content">
                <ng-transclude></ng-transclude>
            </div>
        </section>
        `,
        controller: NotFoundController,
        controllerAs: '$ctrl',
        bindToController: true,
        restrict: 'E',
        transclude: true,
        scope: { },
    };
};
