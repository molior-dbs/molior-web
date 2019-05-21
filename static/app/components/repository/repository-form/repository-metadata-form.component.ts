import { RepositoryService } from '../repository.service';

/**
 * @ngdoc controller
 * @name moliorApp.repository.form.controller:RepositoryMetadataFormController
 * @description
 * A form to edit the metadata of a repository
 *
 */
export class RepositoryMetadataFormController {
    public onUpdate: (...args) => void;
    private url: any;
    private selectedRepository: any;
    private filteredRepositories: any;
    private version: any;

    constructor(
        private RepositoryService: RepositoryService,
        private $scope: angular.IRootScopeService,
    ) { }

    /**
     * @name moliorApp.repository.form.controller:RepositoryMetadataFormController#$onInit
     *
     * Gets called when the component gets initialized.
     * Loads the repositories and subscribes to user events
     */
    public $onInit() {
        this.loadRepositories();
        this.$scope.$watch('$ctrl.url', () => {
            this.onModelChange();
            this.loadRepositories();
        });
        this.$scope.$watch('$ctrl.selectedRepository', () => this.onModelChange());
    }

    /**
     * @name moliorApp.repository.form.controller:RepositoryMetadataFormController#onModelChange
     * Gets called when the user manipulates any data in the UI.
     * Prepares data for the user.
     */
    private onModelChange() {
        // Trim url
        if (this.url) {
            this.url = this.url.trim();
        }
        this.updateSubscribers();
    }

    /**
     * @name moliorApp.repository.form.controller:RepositoryMetadataFormController#updateSubscribers
     * @methodOf moliorApp.repository.form.controller:RepositoryMetadataFormController
     *
     * Updates the depending `on-update` subscribers
     *
     */
    private updateSubscribers() {
        // If none is selected
        if (!this.selectedRepository) {
            return;
        }

        // Check if is a new repository
        const isNewRepository = this.selectedRepository === 'new';

        // Get / Create the repository
        const value = isNewRepository ? { url: this.url } : this.selectedRepository;

        this.onUpdate({ value, isNewRepository });
    }

    /**
     * @name moliorApp.repository.form.controller:RepositoryMetadataFormController#loadRepositories
     * @methodOf moliorApp.repository.form.controller:RepositoryMetadataFormController
     *
     * Loads the repository from the repository service
     * with the set filter `$ctrl.url`.
     *
     */
    private loadRepositories() {
        return this.RepositoryService.all({ page: 0, per_page: 5, q: { url: this.url } })
            .then((data) => {
                const repos = data.results.map((repo) => this.checkIsAlreadyImported(repo));
                this.selectedRepository = this.getRepositoryToSelect(repos, this.url);
                this.filteredRepositories = repos;
            }).then(() => this.$scope.$apply());
    }

    /**
     * @name moliorApp.repository.form.controller:RepositoryMetadataFormController#getRepositoryToSelect
     * @methodOf moliorApp.repository.form.controller:RepositoryMetadataFormController
     *
     * Returns the repository which should automatically get selected.
     * Undefined if none is found
     *
     * @returns {Object} The repository which should automatically get selected.
     * @param {Object} repositories The available repositories
     */
    private getRepositoryToSelect(repositories, url) {
        let selectedRepository;
        if (!repositories.length) {
            // Select "Create New" when none is found
            selectedRepository = 'new';
        } else if (url) {
            // Check if repo url is same as user given url
            selectedRepository = repositories.find((repo) =>
                repo && repo.url.trim() === url.trim() && !repo.disabled,
            );
        }
        return selectedRepository;
    }

    /**
     * @name moliorApp.repository.form.controller:RepositoryMetadataFormController#checkIsAlreadyImported
     * @methodOf moliorApp.repository.form.controller:RepositoryMetadataFormController
     *
     * Checks if the given repository is already imported. If true, it will set `disabled`
     * attribute of the given repository to true. It returns the given repository with the
     * new attribute.
     *
     * @returns {Object} The repository with disabled true or false.
     * @param {Object} repository The repository to check
     */
    private checkIsAlreadyImported(repository) {
        repository.disabled = !!repository.projectversions.find((version) => version.id === this.version.id);
        return repository;
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.repository.form.directive:repositoryMetadataForm
 * @description
 * A form to edit the metadata of a repository
 * @restrict 'E'
 *
 */
export const RepositoryMetadataFormComponent = {
    template: `
<section class="repository-edit">
  <!-- Search Field -->
  <md-input-container flex="100" layout="row">
    <label>URL</label>
    <input ng-model="$ctrl.url" placeholder="" ng-model-options="{ debounce: 200 }" flex="100">
  </md-input-container>
  <md-radio-group required ng-model="$ctrl.selectedRepository" class="md-primary" ng-if="$ctrl.url">
    <!-- New Repository -->
    <md-radio-button aria-label="Add new Repository" class="primary-color" value="new" layout="row" ng-if="!$ctrl.filteredRepositories.length">
      <strong>Add new one</strong>
      <label ng-bind="$ctrl.url"></label>
    </md-radio-button>
    <!-- Repository List -->
    <md-radio-button aria-label="Select Repository {{repository.name}}" ng-disabled="repository.disabled" ng-repeat="repository in $ctrl.filteredRepositories" ng-value="repository">
      <strong ng-bind="repository.name"></strong>
      <label ng-bind="repository.url"></label>
      <md-tooltip ng-if="repository.disabled">
      Already added
      </md-tooltip>
    </md-radio-button>
  </md-radio-group>
</section>
    `,
    controller: RepositoryMetadataFormController,
    bindings: {
        url: '<',
        onUpdate: '&',
        version: '<',
    },
};
