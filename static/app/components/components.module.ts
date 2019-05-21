import * as angular from 'angular';

import { AboutModule } from './about/about.module';
import { ArchitectureModule } from './architecture/architecture.module';
import { BuildModule } from './build/build.module';
import { BuildstateModule } from './buildstate/buildstate.module';
import { BuildvariantModule } from './buildvariant/buildvariant.module';
import { DependencyModule } from './dependency/dependency.module';
import { GettingStartedModule } from './getting-started/getting-started.module';
import { HookModule } from './hook/hook.module';
import { LoginModule } from './login/login.module';
import { MirrorModule } from './mirror/mirror.module';
import { MoliorFooterModule } from './molior-footer/molior-footer.module';
import { MoliorStatusModule } from './molior-status/molior-status.module';
import { ProjectVersionModule } from './project-version/project-version.module';
import { ProjectModule } from './project/project.module';
import { ReleaseNotesModule } from './release-notes/release-notes.module';
import { RepositoryModule } from './repository/repository.module';
import { SharedComponentsModule } from './shared/shared.module';
import { UserRolesModule } from './user-roles/user-form.module';
import { UserModule } from './user/user.module';

/**
 * @ngdoc overview
 * @name moliorApp.components
 * @description
 * # moliorApp.components
 *
 * @requires moliorApp.components.about
 * @requires moliorApp.components.architecture
 * @requires moliorApp.components.project
 * @requires moliorApp.components.project.version
 * @requires moliorApp.components.login
 * @requires moliorApp.components.buildstate
 * @requires moliorApp.components.mirror
 * @requires moliorApp.components.repository
 * @requires moliorApp.components.buildvariant
 * @requires moliorApp.components.user
 * @requires moliorApp.components.user.roles
 * @requires moliorApp.components.build
 * @requires moliorApp.components.shared
 * @requires moliorApp.components.moliorStatus
 * @requires moliorApp.components.moliorFooter
 * @requires moliorApp.components.releaseNotes
 * @requires moliorApp.components.gettingStarted
 * @requires moliorApp.components.dependency
 * @requires moliorApp.components.hook
 */
export const ComponentsModule = angular
    .module('moliorApp.components', [
        AboutModule,
        ProjectModule,
        ProjectVersionModule,
        LoginModule,
        BuildstateModule,
        MirrorModule,
        RepositoryModule,
        BuildvariantModule,
        ArchitectureModule,
        UserModule,
        UserRolesModule,
        BuildModule,
        SharedComponentsModule,
        MoliorStatusModule,
        MoliorFooterModule,
        ReleaseNotesModule,
        GettingStartedModule,
        DependencyModule,
        HookModule,
    ])
    .name;
