import * as angular from 'angular';

import { registerStates } from '@molior/app.util';
import { AboutComponent } from './about.component';
import * as aboutStates from './about.states';

export const AboutModule = angular
    .module('moliorApp.components.about', [])

    // Components
    .component('about', AboutComponent)

    // States
    .config(registerStates(aboutStates))

    .name;
