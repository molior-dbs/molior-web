class BuildLayoutController {}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.directive:projectOverview
 * @description
 * This component displays an overview of projects.
 * It can be filtered using a searchbox.
 * It also has a Create Project button, which creates a new project
 * and a project version.
 *
 * @restrict 'E'
 *
 * @param {Object} query The filter of the project table.
 * @param {object} projects A list of projects
 */
export const BuildLayoutComponent = {
    template: `
<div layout="column" class="project-version-detail">
    <div flex-gt-xs="100" flex-offset-gt-xs="0" class="project-version-detail-subnav">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="row" layout-align="space-between end">
            <h2 layout-margin class="title-spaceing">
                <strong>Builds</strong>
            </h2>
        </div>
    </div>
    <div flex-gt-xs="100" flex-offset-gt-xs="0">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="column">
            <build-overview
                project-version-id="$ctrl.projectVersionId"
                version="$ctrl.version"
                project-id="$ctrl.projectId"
                filters="$ctrl.filters"
                page="$ctrl.page"
                from="$ctrl.from"
                page-size="$ctrl.pageSize"
                currently-failing="$ctrl.currentlyFailing"
                buildstates="$ctrl.buildstates"
            >
            </build-overview>
        </div>
    </div>
</div>
    `,
    controller: BuildLayoutController,
    bindings: {
        projectVersionId: '<',
        version: '<',
        projectId: '<',
        filters: '<',
        page: '<',
        from: '<',
        pageSize: '<',
        currentlyFailing: '<',
        buildstates: '<',
    },
};
