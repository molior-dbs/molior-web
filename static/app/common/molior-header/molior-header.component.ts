import './molior-header.style.scss';

import { IComponentOptions } from 'angular';

interface NavigationItem {
    name: string;
    path: string;
}

class MoliorHeaderController {

    public leftNavigationItems: NavigationItem[] = [
        { name: 'Project', path: 'project' },
        { name: 'Build', path: 'build.overview' },
        { name: 'About', path: 'about' },
    ];

    public rightNavigationItems: NavigationItem[] = [
        { name: 'Mirrors', path: 'mirrors' },
        { name: 'Users', path: 'users' },
    ];

    private showTheForce: boolean;
    private user;
    private status: any;

    constructor(
        private $mdSidenav,
        private Auth,
    ) {
        Auth.session.onChange().then((session) => this.user = session);
        this.showTheForce = this.isStarWarsDay();
    }

    /**
     * Opens the User-Session Menu using $mdOpenMenu
     */
    public openSessionMenu($mdOpenMenu, ev: Event) {
        $mdOpenMenu(ev);
    }

    /**
     * Checks the date, if it is star wars day
     */
    public isStarWarsDay() {
        const dt = new Date();
        const month = dt.getMonth() + 1;
        const day = dt.getDate();
        return month === 5 && day === 4;
    }

    public isInMaintananceMode() {
        const maintananceCookie = document.cookie.replace(/(?:(?:^|.*;\s*)maintanance\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        if (maintananceCookie === 'NO!') {
            return false;
        } else {
            return this.status.maintenance_mode;
        }
    }
}

export const MoliorHeaderComponent: IComponentOptions = {
    template: `
<header md-whiteframe="2" class="molior-header molior-header-size-small">
    <div class="molior-header-content" flex-gt-md="80" flex-offset-gt-md="10" flex="100" flex-offset="0" layout="row">
        <md-button md-ink-ripple="#ffc600" aria-label="Molior Logo" ui-sref="root" class="logo-button">
            <div layout="row" layout-align="center center">
                <div class="molior-logo" ng-class="{'molior-logo-the-fourth': $ctrl.showTheForce}"></div>
            </div>
        </md-button>
        <nav flex="50" ng-if="!$ctrl.isInMaintananceMode()">
            <ul layout="row">
                <li ng-repeat="item in $ctrl.leftNavigationItems">
                    <a ui-sref-active="active" class="md-button" ui-sref="{{::item.path }}">
                        <span ng-bind="::item.name"></span>
                    </a>
                </li>
            </ul>
        </nav>
        <nav flex="50" layout="row" layout-align="end end" ng-if="!$ctrl.isInMaintananceMode()">
            <ul layout="row">
                <li ng-if="$ctrl.user.isAdmin" ng-repeat="item in $ctrl.rightNavigationItems">
                    <a ui-sref-active="active" class="md-button" ui-sref="{{::item.path}}">
                        <span ng-bind="::item.name"></span>
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <md-menu md-position-mode="target-right target">
                        <div class="md-button" aria-label="Username" ng-click="$ctrl.openSessionMenu($mdOpenMenu, $event)">
                            <span ng-if="$ctrl.user.username" layout="row" layout-align="center center">
                                    <div flex ng-bind="$ctrl.user.username" layout-margin></div>
                                    <ng-md-icon icon="keyboard_arrow_down"></ng-md-icon>
                                </span>
                            <span ng-if="!$ctrl.user.username">
                                    <span> Not logged in </span>
                            </span>
                        </div>
                        <md-menu-content class="molior-header-session-menu-container">
                            <md-menu-item>
                                <md-button ng-click="$ctrl.Auth.logout()">Logout</md-button>
                            </md-menu-item>
                        </md-menu-content>
                    </md-menu>
                </li>
            </ul>
        </nav>
        <websocket-status layout-margin ng-if="!$ctrl.isInMaintananceMode()"></websocket-status>
    </div>
</header>
    `,
    controller: MoliorHeaderController,
    bindings: {
        status: '<',
    },
};
