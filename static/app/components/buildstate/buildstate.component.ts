import './buildstate.style.scss';

import { IScope } from 'angular';

import { Util } from '@molior/app.util';
import { BUILDSTATE } from './buildstate.constant';

type Buildstate = typeof BUILDSTATE;
/**
 * @ngdoc controller
 * @name moliorApp.components.buildstate.controller:BuildstateController
 * @description
 * The controller, which decides, which status has which icon.
 * Watches the bound status `$ctrl.status` and updates it
 * automaticly
 *
 * @requires moliorApp.components.buildstate.constant:Buildstate
 */
class BuildstateController {
    public displayName: string;
    public size: number;
    public status: string;
    public icon: string;
    public class: string;

    constructor(
        private Buildstate: Buildstate,
        private Util: Util) {
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildstate.controller:BuildstateController#$onInit
     * @methodOf moliorApp.components.buildstate.controller:BuildstateController
     * @description
     * Initializes the controller and creates
     * a new property '$ctrl.status'
     */
    public $onInit() {
        this.validate(this.status);
        this.displayName = this.Util.unpythonifyVariable(this.status);
        this.size = this.size || 24;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildstate.controller:BuildstateController#$onChange
     * @methodOf moliorApp.components.buildstate.controller:BuildstateController
     * @description
     * Validates the set status and changes to the
     * corresponding icon.
     */
    public $onChanges() {
        this.validate(this.status);
        this.displayName = this.status;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildstate.controller:BuildstateController#validate
     * @methodOf moliorApp.components.buildstate.controller:BuildstateController
     * @description
     * Validates the given statusName and bounds the correspondig class and
     * icon.
     *
     * @param {String} The real statusname, which is written in the molior database.
     */
    public validate(statusName) {
        this.class = 'buildstate-' + statusName;
        switch (statusName) {
        case this.Buildstate.NEW:
            this.icon = 'schedule';
            break;
        case this.Buildstate.SUCCESSFUL:
            this.icon = 'done';
            break;
        case this.Buildstate.SCHEDULED:
            this.icon = 'schedule';
            break;
        case this.Buildstate.BUILD_FAILED:
            this.icon = 'error';
            break;
        case this.Buildstate.BUILDING:
            this.icon = 'sync';
            break;
        case this.Buildstate.PUBLISHING:
            this.icon = 'publish';
            break;
        case this.Buildstate.NEEDS_PUBLISH:
            this.icon = 'call_merge';
            break;
        case this.Buildstate.PUBLISH_FAILED:
            this.icon = 'publish';
            break;
        case this.Buildstate.NEEDS_BUILD:
            this.icon = 'more_horiz';
            break;
        }
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.buildstate.directive:buildStatus
 * @description
 * Displays to every buildstate one correspondig item and a tooltip.
 *
 * @restrict 'E'
 *
 * @param {Object} status An object which has the real name of the buildstatus, which is written in the database and the displayName.
 * @param {Number} size The size of the icon
 */
export const BuildstateComponent = {
    template: `
<div flex layout="row" layout-align="center center">
    <ng-md-icon class="buildstate {{$ctrl.class}}" icon="{{$ctrl.icon}}" size="{{$ctrl.size}}"></ng-md-icon>
    <md-tooltip>
        {{$ctrl.displayName}}
    </md-tooltip>
</div>
    `,
    controller: BuildstateController,
    bindings: {
        status: '<',
        size: '=?',
    },
};
