// Application dependencies
import './dependencies';

import * as angular from 'angular';

// CSS style
import './app.style.scss';

// Application
import { MOLIOR_CONFIG, MoliorConfig } from './app.config';
import { AppComponent } from './app.component';
import * as appStates from './app.states';
import { registerStates, UtilModule } from './app.util';
import { CommonModule } from './common/common.module';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core/core.module';
import { MdDialogCloseHook } from './md-dialog-close.hook';
import { AppService } from './app.service';

/**
 * Main module for molior.
 */
export const AppModule = angular

    // Dependencies
    .module('moliorApp', [
        'ui.router',
        'ngMaterial',
        'mdSteppers',
        'ngMdIcons',
        'rx',
        'md.data.table',
        'chart.js',
        'ngMessages',
        'sticky',
        'ngclipboard',
        'ng-showdown',
        'ui.codemirror',
        CoreModule,
        CommonModule,
        ComponentsModule,
        UtilModule,
    ])
    .config(MoliorConfig.config)
    // Global hooks
    .run(MdDialogCloseHook)

    // States
    .config(registerStates(appStates))

    // Component
    .component('app', AppComponent)

    // Services
    .service('AppService', AppService)

    // Constants
    .constant('MOLIOR_CONFIG', MOLIOR_CONFIG)
    .name;
