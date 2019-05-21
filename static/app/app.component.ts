import { IComponentOptions, IComponentController } from 'angular';
import { StateService } from '@uirouter/core';

class AppController implements IComponentController {
    public isAuthorized: boolean;
    private status: any;
    private clickCount = 0;

    constructor(
        private Auth,
        private $state: StateService,
    ) { }

    public $onInit() {
        this.isAuthorized = this.Auth.isUserAuthorized();
        this.Auth.onUserStateChange(null, null, (state: boolean) => {
            this.isAuthorized = state;
        });
    }

    /**
     * @returns Whether the system is in maintanance mode
     */
    public isInMaintananceMode(): boolean {
        const maintananceCookie = document.cookie.replace(/(?:(?:^|.*;\s*)maintanance\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        if (maintananceCookie === 'NO!') {
            return false;
        } else {
            return this.status.maintenance_mode;
        }
    }

    /**
     * Whether to display a warning, when we are actualy in maintanance mode,
     * but devtools are activated
     * @returns  Whether to show the developer he has devtools activated
     */
    public devMaintananceWarning(): boolean {
        if (!this.status.maintenance_mode) {
            return false;
        } else {
            return !this.isInMaintananceMode() && this.status.maintenance_mode;
        }
    }

    /**
     * Way to exit maintanance mode
     */
    public devtools() {
        this.clickCount = this.clickCount + 1;
        if (this.clickCount === 10) {
            document.cookie = 'maintanance=NO!';
            this.$state.reload();
        }
    }
}

export const AppComponent: IComponentOptions = {
    template: `
<main >
    <!-- HEADER -->
    <molior-header status="$ctrl.status" ng-if="$ctrl.isAuthorized"></molior-header>
    <h1 ng-if="$ctrl.devMaintananceWarning()" class="devtools-message">!!! SYSTEM IS IN MAINTANANCE MODE, BE CAREFUL !!!</h1>

    <!-- CONTENT -->
    <div ng-if="!$ctrl.isInMaintananceMode()" id="main-content" ui-view flex layout="column"></div>
    <molior-footer ng-if="!$ctrl.isInMaintananceMode()" ng-if="$ctrl.isAuthorized"></molior-footer>

    <!-- MAINTANANCE -->
    <div ng-if="$ctrl.isInMaintananceMode()" class="maintanance" layout="row" layout-align="center center">
        <div class="maintanance-penguin" ng-click="$ctrl.devtools()">
        </div>
        <div>
            <h1>We'll be back soon!</h1>
            <p class="maintanance-message">Molior is undergoing maintanance ...</p>
            <p>{{ $ctrl.status.maintenance_message }}</p>
        </div>
    </div>
</main>`,
    controller: AppController,
    bindings: {
        status: '<',
    },
};
