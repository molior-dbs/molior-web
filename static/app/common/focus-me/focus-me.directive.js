/**
 * @ngdoc directive
 * @name moliorApp.common.focusMe.directive:focusMe
 * @description
 * Focus this directive when the value is set to true
 *
 * @example
 <pre>
  <script>
        $ctrl.focus = true;
    </script>
  <input focus-me="$ctrl.focus" />
 </pre>
 *
 * @requires $timeout
 * @requires $parse
 */
export function FocusMeDirective($timeout, $parse) {
    return {
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true || value === undefined) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
            element.bind('blur', function () {
                // Occurs when a e.g. directive creates a new scope
                // This function reapplies the current scope
                if (model && model.assign) {
                    scope.$apply(model.assign(scope, false));
                }
            });
        }
    };
}


