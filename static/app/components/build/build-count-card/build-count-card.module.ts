import * as angular from 'angular';

import { BuildCountCardComponent } from './build-count-card.component';

export const BuildCountCardModule = angular
    .module('moliorApp.components.build.count-card', [])
    .component('buildCountCard', BuildCountCardComponent)
    .name;
