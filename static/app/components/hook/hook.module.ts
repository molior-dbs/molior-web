import * as angular from 'angular';

import { HookFormComponent } from './hook-form/hook-form.component';
import { HookItemDirective } from './hook-overview/hook-item.directive';
import { HookOverviewComponent } from './hook-overview/hook-overview.component';
import { WebhookService } from './webhook.service';

export const HookModule = angular
    .module('moliorApp.components.hook', [])
    .component('hookOverview', HookOverviewComponent)
    .directive('hookItem', HookItemDirective)
    .component('hookForm', HookFormComponent)
    .service('WebhookService', WebhookService)
    .name;
