import * as angular from 'angular';

import { AnsiupModule } from './ansiup/ansiup.module';
import { EditableInputModule } from './editable-input/editable-input.module';
import { FaviconModule } from './favicon/favicon.module';
import { FocusMeModule } from './focus-me/focus-me.module';
import { LogModule } from './log/log.module';
import { MoliorHeaderModule } from './molior-header/molior-header.module';
import { SlideableModule } from './slideable/slideable.module';
import { NotifyModule } from './notify/notify.module';

/**
 * Module for "shared" components / services / etc.
 */
export const CommonModule = angular
    .module('moliorApp.common', [
        MoliorHeaderModule,
        LogModule,
        FaviconModule,
        SlideableModule,
        FocusMeModule,
        AnsiupModule,
        EditableInputModule,
        NotifyModule,
    ])
    .name;
