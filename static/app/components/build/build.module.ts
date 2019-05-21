import * as angular from 'angular';

import { BuildChartModule } from './build-chart/build-chart.module';
import { BuildCountCardModule } from './build-count-card/build-count-card.module';
import { BuildDetailModule } from './build-detail/build-detail.module';
import { BuildLogModule } from './build-log/build-log.module';
import { BuildOverviewModule } from './build-overview/build-overview.module';
import { BuildService } from './build.service';
import { BuildLayoutComponent } from './build-overview/build-layout.component';
import * as states from './build.states';
import { registerStates } from '../../app.util';

/**
 * @ngdoc overview
 * @name moliorApp.components.build
 * @description
 * # moliorApp.components.build
 *
 * @requires moliorApp.components.build.chart
 * @requires moliorApp.components.build.overview
 * @requires moliorApp.components.build.log
 * @requires moliorApp.components.build.detail
 * @requires moliorApp.components.build.count-card
 */
export const BuildModule = angular
    .module('moliorApp.components.build', [
        BuildChartModule,
        BuildOverviewModule,
        BuildLogModule,
        BuildDetailModule,
        BuildCountCardModule,
    ])
    .service('BuildService', BuildService)
    .component('buildLayout', BuildLayoutComponent)
    .config(registerStates(states))
    .name;
