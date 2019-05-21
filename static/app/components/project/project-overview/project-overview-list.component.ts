import { IComponentOptions } from 'angular';

export const ProjectOverviewListComponent: IComponentOptions = {
    template: `
<md-list-item
    ui-sref="project-detail({projectId: project.id})"
    layout="row"
    ng-repeat="project in $ctrl.projects | orderBy:'name'"
    class="noright"
>
        <div flex="20">
            <strong ng-bind="project.name"></strong>
        </div>
        <div ng-style="!project.description && {'color': '#888'}" flex="80">
            {{project.description.split('\n')[0] || "No description"}}
        </div>
    </a>
</md-list-item>`,
    bindings: {
        projects: '<',
    },
};
