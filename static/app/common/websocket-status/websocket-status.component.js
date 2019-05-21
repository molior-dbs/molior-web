import './websocket-status.style.scss';

/**
 * @ngdoc controller
 * @name moliorApp.common.websocketStatus.controller:WebsocketStatusController
 * @description
 * Checks, using Cirrina, the current websocket status
 */
function WebsocketStatusController(Cirrina, $scope) {
    var $ctrl = this;
    $ctrl.status = Cirrina.status.status;
    Cirrina.status.subscribe(status => {
        $ctrl.status = status;
        $scope.$apply();
    });
}


/**
 * @ngdoc directive
 * @name moliorApp.common.websocketStatus.directive:websocketStatus
 * @description
 * Adds a small circle, which indicates, using Cirrina, if the
 * websocket service is connected (green) or disconnected (red)
 * @restrict 'E'
 */
export const WebsocketStatusComponent = {
    template: '<div class="websocket-status" ng-class="{\'websocket-status-connected\': $ctrl.status === 1, \'websocket-status-disconnected\': $ctrl.status === 0 }">' +
    '<md-tooltip md-direction="bottom">' +
    '<span ng-bind="$ctrl.status === 1 ? \'Websocket Connected\' : \'Websocket Disconnected\' "></span>' +
    '</md-tooltip>' +
    '</div>',
    controller: WebsocketStatusController
};
