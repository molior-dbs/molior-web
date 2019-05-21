import * as angular from 'angular';

import { ErrorDirective } from './error/error.directive';
import { InformationDirective } from './information/information.directive';
import { NotFoundDirective } from './not-found/not-found.directive';
import { WarningDirective } from './warning/warning.directive';

export const SharedComponentsModule = angular
    .module('moliorApp.components.shared', [])
    .directive('notFound', NotFoundDirective)
    .directive('information', InformationDirective)
    .directive('warning', WarningDirective)
    .directive('error', ErrorDirective)
    .name;
