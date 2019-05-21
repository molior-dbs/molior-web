// FIXME:_ REMOVE THIS BULLSHIT!!! NO JQUERY
// SHAME ON LIVIO SOME YEARS AGO >:(
import $ from 'jquery';

/**
 * @ngdoc controller
 * @name moliorApp.common.favicon.controller:FaviconController
 * @description
 * This controller is used by {@link moliorApp.common.favicon.directive:favicon favicon Directive}
 * Changes the icon of molior when 
 * {@link moliorApp.common.favicon.service:Favicon Favicon.setFavicon} is called
 * 
 * @requires moliorApp.common.favicon.service:Favicon
 * @requires moliorApp.common.favicon.constant:FaviconType
 * @requires $scope
 */
function FaviconController(Favicon, FaviconType, $scope) {
    var $ctrl = this;

    /**
     * @ngdoc 
     * @name moliorApp.common.favicon.controller:FaviconController#$onInit
     * @methodOf moliorApp.common.favicon.controller:FaviconController
     *
     * @description
     * Initializes the favicon directive. Starts listening on 
     * favicon changes.
     */
    $ctrl.$onInit = function () {
        $ctrl.faviconPath = FaviconType.DEFAULT;
        Favicon.onFaviconChange().then(null, null, function (path) {
            $scope.faviconPath = path;
        });

    };

    $ctrl.$onInit();
}

function FaviconLink(scope, element) {
    scope.$watch('faviconPath', function (path) {
        if (path) {
            // Add ?={Number} to disable caching
            $(element).attr('href', path + '?=' + Math.random());
        }
    });
}

/**
 * @ngdoc directive
 * @name moliorApp.common.favicon.directive:favicon
 * @description
 * Changes the icon of molior when 
 * {@link moliorApp.common.favicon.service:Favicon Favicon.setFavicon} is called
 * @restrict 'A'
 */
export const FaviconDirective = () => {
    return {
        bindToController: true,
        controller: FaviconController,
        controllerAs: '$ctrl',
        restrict: 'A',
        link: FaviconLink
    };
};