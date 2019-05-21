import * as angular from 'angular';
import { MoliorInfoService } from './molior-info.service';

export const InfoModule = angular
    .module('moliorApp.core.api.info', [])
    .service('MoliorInfoService', MoliorInfoService)
    .name;
