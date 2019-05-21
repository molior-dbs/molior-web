import { IComponentOptions } from 'angular';
import { ProjectVersionService } from '../project-version.service';
import './project-version-info.style.scss';
import { BuildvariantService } from '@molior/components/buildvariant/buildvariant.service';
import { Buildvariant } from '@molior/components/buildvariant/interfaces';
import { ProjectVersionDetail } from '../interfaces';
import { StateService } from '@uirouter/core';
import { Notify } from '@molior/common/notify/notify.service';

/**
 * @ngdoc controller
 * @name moliorApp.components.project.version.detail.controller:ProjectVersionInfoController
 * @description
 * Handles the project version detail functionality.
 * This controller is used by {@link moliorApp.components.project.version.detail.directive:ProjectVersionInfo ProjectVersionInfo Component}
 */
class ProjectVersionDependencyFormController {

    private dependency: ProjectVersionDetail;
    private buildvariant: Buildvariant;
    private projectVersionId: number;
    private items: ProjectVersionDetail[];
    private searchText: string;

    constructor(
        private $mdDialog,
        private $state: StateService,
        private ProjectVersionService: ProjectVersionService,
        private BuildvariantService: BuildvariantService,
        private Notify: Notify,
        private $mdToast: any,
    ) { }

    public async submit() {
        if (this.dependency) {
            try {
                await this.ProjectVersionService
                    .addDependency(
                        this.projectVersionId, this.dependency.id,
                    );
                this.$state.reload();
            } catch (err) {
                this.$mdToast.show(this.Notify.notify(
                    `Could not add dependency '${this.dependency.project.name} / ${this.dependency.name}'`,
                ));
            }
        }
    }

    public selectedItemChange(item: any) {
        this.dependency = item;
    }

    public search(text: string) {
        if (!text) {
            return this.items;
        }
        return this.items.filter((dep) => {
            return dep.name.includes(text)
                || dep.project.name.includes(text)
                || `${dep.project.name} / ${dep.name}`.includes(text);
        });
    }

    /**
     * @ngdoc
     * @name moliorApp.components.project.version.detail.controller:MirrorFormController#cancel
     * @description
     * # Handler function for 'Cancel' button
     * This function exits and closes the modal dialog
     *
     * @example
     * <pre>
     *   $ctrl.cancel();
     * </pre>
     *
     */
    public cancel() {
        this.$mdDialog.cancel();
    }

    public async $onInit() {
        this.buildvariant = (await this.BuildvariantService
            .byProjectversion(
                this.projectVersionId,
            )
        ).results[0];

        this.items =  (await this.ProjectVersionService.all({ basemirror_id: this.buildvariant.basemirror_id }))
            .results
            .filter((version) => version.id !== this.projectVersionId);
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.version.detail.directive:ProjectVersionInfo
 * @description
 * This component displays a version of a project.
 * This component has substates, which should be related, to the current project version.
 * @restrict 'E'
 */
export const ProjectVersionDependencyFormComponent: IComponentOptions = {
    template: `
<div class="mirror-create-new" flex>
    <md-toolbar>
        <div class="md-toolbar-tools">
            <h2>Add a dependency</h2>
            <span flex></span>
            <md-button aria-label="Close Dependency chooser" class="md-icon-button" ng-click="$ctrl.cancel()">
                <ng-md-icon icon="close" style="fill:rgba(255,255,255,0.87);" />
            </md-button>
        </div>
    </md-toolbar>
    <md-toolbar class="project-version-info">
        <div class="md-toolbar-tools">
            <em>
                You can only add project versions as a dependency which are based
                on the <strong ng-bind="$ctrl.buildvariant.basemirror + '-' + $ctrl.buildvariant.basemirror_version"></strong> basemirror.
            </em>
        </div>
    </md-toolbar>
    <form layout-padding ng-submit="$ctrl.submit()">
        <md-autocomplete
            md-no-cache="true"
            md-selected-item="$ctrl.dependency"
            md-search-text="$ctrl.searchText"
            md-selected-item-change="$ctrl.selectedItemChange(item)"
            md-items="item in $ctrl.search($ctrl.searchText)"
            md-min-length="0"
            md-item-text="item.project.name + ' / ' + item.name"
            placeholder="Choose a dependency">
            <md-item-template>
                <span md-highlight-text="ctrl.searchText" md-highlight-flags="^i">{{item.project.name}} / {{item.name}}</span>
            </md-item-template>
            <md-not-found>
                No states matching "{{$ctrl.searchText}}" were found.
            </md-not-found>
        </md-autocomplete>
        <div flex layout="row" layout-align="end center">
            <md-button class="md-primary" ng-click="$ctrl.cancel()">Cancel</md-button>
            <md-button class="md-primary md-raised" ng-disabled="!$ctrl.dependency" type="submit">Add</md-button>
        </div>
    </form>
</div>
    `,
    controller: ProjectVersionDependencyFormController,
    bindings: {
        projectVersionId: '<',
    },
};
