import * as angular from 'angular';
import * as ansiup from 'ansi_up';

// FIXME:_ REMOVE THIS BULLSHIT!!! NO JQUERY
// SHAME ON LIVIO SOME YEARS AGO >:(
import $ from 'jquery';

/**
 * @ngdoc directive
 * @name moliorApp.common.ansiup.directive:ansiup
 * @description
 * Wrapper around [ansi_up library](https://github.com/drudru/ansi_up).
 * Will replace the bound ANSI-string with colorized html.
 *
 * @param {String} ansiup The ANSI string
 * @param {Number} ansiupLogline The logline to jump to
 * @param {Function} ansiupOnLinefocusChanged Gets called when the focus of a logline changes
 * @restrict 'AE'
 */
export function AnsiupDirective() {
    return {
        link: function (scope, element) {
            var ansi_up = new ansiup.default;
            var allLogs = [],
                logCounter = 0,
                isRendered = false;
            element.append('<table class="log-table"></table>');

            scope.$watchCollection('value', function (value) {
                if (value &&
                    value.length > allLogs.length) {
                    var newLogs = value.slice(allLogs.length, value.length);
                    allLogs.push.apply(allLogs, newLogs);
                    renderLogs(newLogs);
                    isRendered = true;
                    gotoLine(scope.logline);
                }
            });

            scope.$watch('logline', function (number) {
                if (number && isRendered) {
                    gotoLine(number);
                }
            });

            /**
             * @name gotoLine
             * @description
             * Jumps to a log line and sets the state to active
             * @param {Number} number The logline number
             */
            function gotoLine(number) {
                $('.log-table tr').removeClass('active');
                var $line = $('#L' + number);
                if ($line.length) {
                    $line.addClass('active');
                    $(window).scrollTop($line.offset().top - 125);
                    scope.ansiupOnLinefocusChanged({
                        value: number
                    });
                }

            }
            function escapeHtml(string) {
                return string
                    .replace('&amp;', '&')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace('&quot;', '"')
                    .replace('&#39;', '\'')
                    .replace('&#x2F;', '/')
                    .replace('&#x60;', '`')
                    .replace('&#x3D;', '=');
            }

            function renderLogs(logLines) {
                var log = '';

                logLines.forEach((element) => {
                    logCounter++;
                    log += '<tr id="L' + logCounter + '">' +
                        '<td class="log-number" data-line-number="' + logCounter + '"></td>' +
                        '<td class="log-line"><span>' + ansi_up.ansi_to_html(escapeHtml(element)) + '</span></td>' +
                        '</tr>';
                });

                angular.element(element[0].querySelectorAll('.log-table')).append(log);

                $('.log-table tr .log-number').click(function () {
                    gotoLine($(this).data('line-number'));
                });
            }

            scope.gotoLine = gotoLine;
        },
        restrict: 'AE',
        scope: {
            'value': '=ansiup',
            'logline': '=ansiupLogline',
            'ansiupOnLinefocusChanged': '&'
        }
    };
}
