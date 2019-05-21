import * as angular from 'angular';

import { ReleaseNotesComponent } from './release-notes.component';
import { ReleaseNotesService } from './release-notes.service';
import { registerStates} from '@molior/app.util';
import * as releaseNotesStates from './release-notes.states';

/**
 * This module is here for everything release notes related.
 */
export const ReleaseNotesModule = angular
    .module('moliorApp.components.releaseNotes', [])
    .component('releaseNotes', ReleaseNotesComponent)
    .service('ReleaseNotesService', ReleaseNotesService)
    .config(registerStates(releaseNotesStates))
    .name;
