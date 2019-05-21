import { ProjectDetail, Version } from '../interfaces';
import './project-versions.style.scss';
import { IRootScopeService } from 'angular';
import { StateService } from '@uirouter/core';
import { ProjectService } from '../project.service';

class ProjectVersionsController {
    private query: string;
    private project: ProjectDetail;
    private versions: Version[];
    private reverse: boolean;
    private showDeleted: boolean = false;

    public constructor(
        private ProjectService: ProjectService,
        private $scope: IRootScopeService,
    ) {
        this.$scope.$watch(
            () => this.showDeleted,
            () => this.loadFiltered(),
        );
    }

    public $onInit() {
        this.versions = this.project.versions;
        this.reverse = true;
    }

    public search() {
        if (!this.query) {
            this.versions = this.project.versions;
        } else {
            this.versions = this.project.versions
                .filter((version) => version.name.includes(this.query));
        }
    }

    public async loadFiltered() {
        this.project = await this.ProjectService.byDeletedFilter(this.project.id, this.showDeleted);
        this.search();
        this.$scope.$apply();
    }

    public toggleReverseFilter() {
        this.reverse = !this.reverse;
    }
}

export const ProjectVersionsComponent = {
    template: `
<md-card id="project-versions-filter" ng-class="{ 'project-versions-popup': $ctrl.small, 'md-whiteframe-24dp': $ctrl.small }" layout="column">
    <div id="project-versions-filter-inner" class="project-overview-filter" layout="row">
        <md-autocomplete flex
            ng-model-options="{ debounce: 500 }"
            md-search-text-change="$ctrl.search()"
            md-search-text="$ctrl.query"
            md-items="item in []"
            placeholder="Name">
        </md-autocomplete>
        <md-checkbox
            ng-if="!$ctrl.small"
            class="header-checkbox deleted-filter-checkbox"
            ng-model="$ctrl.showDeleted"
            aria-label="show deleted"
        >
            <strong>Show deleted</strong>
        </md-checkbox>
        <ng-md-icon
            id="toggle-icon"
            ng-click="$ctrl.toggleReverseFilter()"
            size="35"
            icon="{{ $ctrl.reverse && 'arrow_drop_down' || 'arrow_drop_up' }}"
            style="
                fill: rgb(255, 255, 255);
                margin-left: 15px
            "
        ></ng-md-icon>
    </div>
    <div ng-class="{ 'project-versions-overflow': $ctrl.small }">
        <md-list-item
            ui-sref="project-version.info({projectId: $ctrl.project.id, versionId: version.id})"
            layout="row"
            aria-label="$version.name"
            ng-repeat="version in $ctrl.versions | orderBy:'name':$ctrl.reverse"
            class="noright">
            <div>
                <strong ng-bind="version.name"></strong>
            </div>
        </md-list-item>
    </div>
    <div class="no-deps" ng-if="$ctrl.versions.length == 0">
        <i>no versions</i>
    </div>
</md-card>
    `,
    controller: ProjectVersionsController,
    bindings: {
        project: '<',
        small: '<',
    },
};
