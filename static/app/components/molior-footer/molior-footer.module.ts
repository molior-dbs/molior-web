import * as angular from 'angular';

import { MoliorFooterComponent } from './molior-footer.component';

export const MoliorFooterModule = angular
    .module('moliorApp.components.moliorFooter', [])
    .component('moliorFooter', MoliorFooterComponent)
    .name;
