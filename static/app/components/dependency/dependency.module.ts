import * as angular from 'angular';

import { DependencySelectionDirective } from './dependency-selection.directive';

export const DependencyModule = angular
    .module('moliorApp.components.dependency', [])
    .directive('dependencySelection', DependencySelectionDirective)
    .name;
