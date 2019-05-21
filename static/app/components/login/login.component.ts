import './login.style.scss';

import { StateService, TargetState } from '@uirouter/angularjs';
import { IComponentOptions } from 'angular';

/**
 * @ngdoc controller
 * @name moliorApp.components.login.controller:LoginController
 * @description
 * Handles the login functionality. This controller is used by {@link moliorApp.components.login.directive:login Login Component}
 *
 * @requires moliorApp.core.auth.service:Auth
 * @requires $state
 * @requires $location
 */
export class LoginController {
    public returnTo: string;
    public username: string;
    public password: string;
    public failedLogin: boolean = false;
    public focus: { username: boolean } = { username: false };

    constructor(
        private Auth,
        private $state: StateService,
    ) { }

    public $onInit() {
        if (this.Auth.isUserAuthorized()) {
            this.returnToOriginalState(false);
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.login.controller:LoginController#login
     * @methodOf moliorApp.components.login.controller:LoginController
     *
     * @description
     * Logs a user in using {@link moliorApp.core.auth.service:Auth Auth Service}.
     * If it fails, it will set `$ctrl.failedLogin = true`, otherwise redirects to
     * project-overview state
     *
     * @returns {Promise} When authenticated
     * @example
     * <pre>
     *    $crl.username = "admin";
     *    $ctrl.password = "1234";
     *    $ctrl.login();
     * </pre>
     */
    public async login() {
        try {
            await this.Auth.login(this.username, this.password);
            this.returnToOriginalState(true);
        } catch (err) {
            this.failedLogin = true;
            return;
        }

    }

    private returnToOriginalState(forceReload: boolean) {
        // hard redirect to original state
        window.location.href = this.returnTo;
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.login.directive:login
 * @description
 * This component displays the login page.
 *
 * @restrict 'E'
 * @param {String} returnTo The path which it should return to, as soon as someone logged in
 */
export const LoginComponent: IComponentOptions = {
    template: `
<div class="login">
    <div class="header-enlargener"></div>
    <div id="login-container">
        <md-card class="md-whiteframe-5dp" flex-gt-md="80" flex-offset-gt-md="10" flex-gt-xs="100" flex-offset-gt-xs="0">
            <div id="login-content">
                <header id="login-header" flex layout="column" layout-align="start center">
                    <div class="molior-logo --large"></div>
                </header>
                <div layout-padding flex-gt-md="60" flex-offset-gt-md="20" flex-gt-xs="100" flex-offset-gt-xs="0">
                    <form ng-submit="$ctrl.login()">
                        <div ng-if="$ctrl.failedLogin" flex layout="row" class="message error-message" layout-padding>
                            <ng-md-icon size="40" icon="error"></ng-md-icon>
                            <div flex>
                                Incorrect username or password.
                            </div>
                        </div>
                        <div layout-padding layout="column">
                            <md-input-container flex-gt-md="80" flex-gt-md-offset="20" ng-class="{'md-input-focus': $ctrl.focus.username}">
                                <input name="username" type="text" ng-model="$ctrl.username" focus-me="$ctrl.focus.username" required placeholder="Username"
                                    aria-label="username">
                            </md-input-container>
                            <md-input-container flex-gt-md="80" flex-gt-md-offset="20">
                                <input name="password" type="password" ng-model="$ctrl.password" required placeholder="Password" aria-label="password">
                            </md-input-container>
                            <md-button type="submit" aria-label="Login"> Login </md-button>
                        </div>
                    </form>
                </div>
            </div>
        </md-card>
    </div>
</div>`,
    controller: LoginController,
    bindings: {
        returnTo: '<',
    },
};
