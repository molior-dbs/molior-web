import * as angular from 'angular';

import { ArchitectureService } from './architecture.service';

export const ArchitectureModule = angular
    .module('moliorApp.components.architecture', [])
    .service('ArchitectureService', ArchitectureService)
    .name;
