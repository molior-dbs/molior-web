/**
 * Shows statistics of a repository
 */
export class RepositoryDetailStatsController { }

/**
 * Shows statistics of a repository
 */
export const RepositoryDetailStatsComponent = {
    template: `
<section flex layout="row" class="animate-in">
    <build-count-card ui-sref="^.^.build.overview.filter({buildstate: 'successful', sourcerepository_id: $ctrl.repository.id })" version="$ctrl.version" type="success" repository="$ctrl.repository" flex="33"></build-count-card>
    <build-count-card ui-sref="^.^.build.overview.filter({buildstate: ['publish_failed', 'build_failed'], sourcerepository_id: $ctrl.repository.id})" version="$ctrl.version" type="failed" repository="$ctrl.repository" flex="33"></build-count-card>
    <build-count-card ui-sref="^.^.build.overview.filter({sourcerepository_id: $ctrl.repository.id})" version="$ctrl.version" type="total" repository="$ctrl.repository" flex="33"></build-count-card>
</section>
    `,
    controller: RepositoryDetailStatsController,
    bindings: {
        repository: '<',
        version: '<',
    },
};
