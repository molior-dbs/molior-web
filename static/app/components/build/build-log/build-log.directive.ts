import './build-log.style.scss';

// FIXME:_ REMOVE THIS BULLSHIT!!! NO JQUERY
// SHAME ON LIVIO SOME YEARS AGO >:(
import * as $ from 'jquery';
import { keys } from 'lodash';

// tslint:disable-next-line:no-var-requires
const template = require('./build-log.tmp.html');

/**
 * This is the controller for Buildlog Directive
 * It fetches the buildlog and binds it to the controller
 */
class BuildlogController {

    /**
     * Watches scroll events on the window
     * element and checks when the user
     * scrolled over the bottom of the buildlog
     *
     * @static
     */
    public static link(scope, element) {
        const $window = $(window);
        const $element = $(element);

        /**
         * @name checkScrollBottom
         * @description
         * Checks if the user scrolled over the bottom
         * of the buildlog. If true, it sets
         * stickyScroll to true on the scope, or
         * false
         */
        function checkScrollBottom() {
            const elementBottom = $element.offset().top + $element.height();
            const scrollBottom = $window.scrollTop() + $window.height();
            if (scrollBottom >= elementBottom) {
                scope.stickyScroll = true;
            } else {
                scope.stickyScroll = false;
            }
        }

        $window.on('scroll', checkScrollBottom);
    }

    private logger: any;
    private build: any;
    private onBuildChange: any;
    private onLivelogAdd: any;
    private logline: any;
    private buildDurationInterval: any;
    private isLoading: boolean;
    private logLines: any;
    private logNotFound: boolean;

    constructor(
        private $anchorScroll: any,
        private Cirrina: any,
        private Util: any,
        private $scope: any,
        private Log: any,
        private $state: any,
        private $stateParams: any,
        private $interval: any,
        private BuildService: any,
    ) {
        this.logger = Log.init('BuildLogDirective');
    }

    /**
     * Initializes the component.
     * Starts listening to build & livelog websocket events
     *
     * Loads requiremented data
     */
    public $onInit() {
        this.build = this.build;

        this.logger.info('Subscribe to "build"-events');
        this.onBuildChange = this.Cirrina
            .when(this.Cirrina.subject.BUILD, this.Cirrina.event.CHANGED);
        this.onBuildChange
            .then()
            .subscribe((message) => this.onBuildReceive(message));

        this.logger.info('Subscribe to "livelog"-events');
        this.onLivelogAdd = this.Cirrina
            .when(this.Cirrina.subject.LIVELOG, this.Cirrina.event.ADDED);
        this.onLivelogAdd
            .then()
            .subscribe((message) => this.onLivelogReceive(message));

        this.logline = this.logline || this.$stateParams.logline;

        this.load();
        this.startLiveLog();
        this.buildDurationInterval = this.$interval(() => this.updateBuildDuration(), 1000);
    }

    /**
     * Destroys the component.
     * Stops listening to build & livelog websocket events
     */
    public $onDestroy() {
        this.logger.info('Unsubscribe from "build"-events');
        this.onBuildChange.unsubscribe();
        this.logger.info('Unsubscribe from "livelog"-events');
        this.onLivelogAdd.unsubscribe();

        this.stopLiveLog();
        this.$interval.cancel(this.buildDurationInterval);
    }

    /**
     * Starts the livelog
     */
    private startLiveLog() {
        this.Cirrina
            .emit(this.Cirrina.subject.LIVELOG, this.Cirrina.action.START, {
                build_id: this.build.id,
            });
    }

    /**
     * Stops the livelog
     */
    private stopLiveLog() {
        this.Cirrina
            .emit(this.Cirrina.subject.LIVELOG, this.Cirrina.action.STOP, {
                build_id: this.build.id,
            });
    }

    /**
     * Updates the duration of this build
     */
    private updateBuildDuration() {
        if (!this.build.endstamp || this.build.endstamp === 'None') {
            this.build.duration = this.Util.getFormattedDurationOfBuild(this.build);
        }
        this.build.startString = this.Util.getFormattedTimestamp(this.build.startstamp);
    }

    /**
     * Loads the buildlog of the bound build.
     *
     * @example
     * <pre>
     *    $ctrl.build = {
     *        'id': 1
     *  };
     *  $ctrl.load();
     *    console.log($ctrl.logLines) // The log split after \n
     * </pre>
     */
    private load() {
        this.isLoading = true;
        this.BuildService
            .getLog(this.build.id)
            .then((log) => {
                this.isLoading = false;
                this.logLines = log.split('\n');
                const lastLogline = this.logLines[this.logLines.length - 1];
                if (lastLogline === '') {
                    this.logLines.splice(this.logLines.length - 1, 1);
                }
            }, (data) => {
                this.isLoading = false;
                this.logger.error('Log not found on system', data);
                this.logNotFound = true;
            });
    }

    /**
     * Scroll to the top of the buildlog
     *
     * @example
     * <pre>
     *    $ctrl.scrollUp();
     * </pre>
     */
    private scrollUp() {
        this.$anchorScroll('buildlog-top');
    }

    /**
     * Scroll to the bottom of the buildlog
     *
     * @example
     * <pre>
     *    $ctrl.scrollDown();
     * </pre>
     */
    private scrollDown() {
        this.$anchorScroll('buildlog-bottom');
    }

    /**
     * Gets called when a build gets pushed from cirrina
     */
    private onBuildReceive(build) {
        if (build.id === this.build.id) {
            this.updateBuild(build);
        }
    }

    /**
     * Gets called when a livelog line gets pushed from cirrina
     */
    private onLivelogReceive(message) {
        this.logLines.push(message);
        if (this.$scope.stickyScroll) {
            this.scrollDown();
        }
        this.$scope.$apply();
    }

    /**
     * Updates the given build in the UI, if it exists
     *
     * @param {Object} build The build to update
     */
    private updateBuild(build) {
        const localBuild = this.build;
        this.logger.info('Build changed!', build);
        const serverBuild = this.Util.normalizeBuild(build);
        keys(serverBuild).forEach((key) => localBuild[key] = serverBuild[key]);
        this.Util.setFaviconbyBuildstatename(localBuild.buildstate);
        this.build = localBuild;
        this.$scope.$apply();
    }

    /**
     * Update state. If the logline is already set, it will change to
     * the "sibling"-logline state. If it is not set, it will change
     * from build to build.logline substate. Changes the state
     * without reloading
     *
     * @param {Object} build The build to update
     */
    private updateState(logNumber) {
        let statename = '.logline';
        if (this.logline) {
            // Go to sibling state
            statename = '^' + statename;
        }
        this.$state.transitionTo(statename, {
            logline: logNumber,
        }, {
            inherit: true,
            relative: this.$state.$current,
            notify: false,
            reload: false,
        });
    }
}

/**
 * This component can be used in $mgDialog.
 * It display the buildlog of the bound build
 *
 * @param {Object} build The build you want to see the buildlog
 * @param {Number} logline The logline it should jump to. Is a positive integer.
 * @restrict 'E'
 */
export const BuildLogDirective = () => {
    return {
        bindToController: true,
        controllerAs: '$ctrl',
        restrict: 'E',
        templateUrl: template,
        controller: BuildlogController,
        scope: {
            build: '<',
            logline: '<',
        },
        link: BuildlogController.link,
    };
};
