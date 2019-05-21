import './repository-form.style.scss';

import { cloneDeep } from 'lodash';
import * as toastr from 'toastr';
import { ArchitectureService } from '@molior/components/architecture/architecture.service';
import { ProjectVersionService } from '@molior/components/project-version/project-version.service';
import { BuildvariantService } from '@molior/components/buildvariant/buildvariant.service';

/**
 * @ngdoc controller
 * @name moliorApp.components.repository.form.controller:RepositoryFormController
 * @description
 * Controller for {@link moliorApp.components.repository.form.directive:repositoryForm Repository Form Component}.
 */
class RepositoryFormController {

    private isNewRepository: any;
    private project: any;
    private version: any;
    private isDependencySelectionDisabled: boolean;
    private dependencies: any;
    private repository: any;
    private allowedBuildsOptions: any;
    private architectures: any;
    private basemirrors: any;
    private currentStep: number;
    private isStepperLinear: boolean;

    constructor(
        private $q: any,
        private $mdDialog: any,
        private $scope: angular.IRootScopeService,
        private $mdStepper: any,
        private RepositoryService: any,
        private ProjectVersionService: ProjectVersionService,
        private BuildvariantService: BuildvariantService,
        private ArchitectureService: ArchitectureService,
        private $state: any,
    ) { }

    public $onInit() {
        this.$scope.$apply();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#createOrImportRepository
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     *
     * @description
     * Create or import the given repository, depending if
     * 'isNewRepository' on the controller is set.
     * Closes the dialog if it worked
     */
    private createOrImportRepository(newRepository) {
        const importRepo = (repo) => this.importRepository(repo);

        if (!this.isNewRepository) {
            return importRepo(newRepository);
        } else {
            return this
                .createRepository(newRepository)
                .then((data) => {
                    // Add new repository id to local repository
                    newRepository.id = data.data.id;
                    return importRepo(newRepository);
                });
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#createRepository
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     *
     * @description
     * Creates a new repository using {@link moliorApp.components.repository.service:RepositoryService RepositoryService}.
     * If it worked and displays a toastr message.
     * If it caught an error, it will display an error toastr with the error message.
     *
     * @param {Object} repository The new repository, which should get added in the database
     */
    private createRepository(repository) {
        const newRepository = cloneDeep(repository);
        newRepository.dependency_id = (repository.dependencies || []).map((dependency) => dependency.id);
        return this.RepositoryService.post(newRepository);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#importRepository
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     *
     * @description
     * Imports the given repository to the current project version `$ctrl.version.id`.
     * Gets all buildvariant ids before importing. Displays a toastr message, if
     * The request failed or succeeded.
     *
     * @param {Object} newRepository the new repository, which gets added to the current project version
     *
     */
    private importRepository(newRepository) {
        return this.ProjectVersionService
            .postSourceRepository(this.version.id, newRepository);
    }

    private loadAllowedBuildOptions() {
        return this.BuildvariantService.all({ projectversion_id: this.version.id }).then((data) => {
            this.allowedBuildsOptions = data.results.map((buildOption) => ({
                basemirrorId: buildOption.basemirror_id,
                architectureId: buildOption.architecture_id,
            }));
        });
    }

    private loadArchitectures() {
        return this.ArchitectureService
            .all()
            .then((data) => this.architectures = data.results)
            .then(() => this.$scope.$apply());
    }

    private loadBasemirrors() {
        return this.ProjectVersionService
            .byDependant(this.version.id)
            .then((data) => this.basemirrors = data.results);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#cancel
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     *
     * @description
     * Cancels the current `$mdDialog`
     *
     */
    private cancel() {
        this.$mdDialog.cancel();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#openBuildOptionsStep
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     * @description
     * This function goes to the build options step of the repository form
     * material design stepper
     */
    private openBuildOptionsStep() {
        this.currentStep = 1;
        this.isStepperLinear = true;
        this.$mdStepper('repository-form-stepper').goto(1);
        this.loadAllowedBuildOptions();
        this.loadArchitectures();
        this.loadBasemirrors();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#openConfirmationStep
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     * @description
     * This function goes to the confirmation step of the repository form
     * material design stepper
     */
    private openConfirmationStep() {
        this.currentStep = 2;
        this.isStepperLinear = true;
        this.$mdStepper('repository-form-stepper').goto(2);
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#previousStep
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     * @description
     * This function goes to the previous step of the repository form
     * material design stepper
     */
    private previousStep() {
        this.currentStep--;
        this.isStepperLinear = false;
        this.$mdStepper('repository-form-stepper').back();
    }

    /**
     * @ngdoc
     * @name moliorApp.components.repository.form.controller:RepositoryFormController#confirm
     * @methodOf moliorApp.components.repository.form.controller:RepositoryFormController
     * @description
     * Confirms the form and creates or imports the edited repository
     */
    private confirm() {
        const newRepo = cloneDeep(this.repository);
        newRepo.buildvariants = this.repository.buildvariants.map((repo) => ({
            architecture_id: repo.architectureId,
            base_mirror_id: repo.basemirrorId,
        }));

        return this.createOrImportRepository(newRepo)
            .then(() => {
                toastr.success('Successfully added the repository');
                this.$mdDialog.hide();
                this.$state.go('project-version.repository.detail', {
                    projectId: this.project.id,
                    versionId: this.version.id,
                    repositoryId: newRepo.id,
                });
            })
            .catch((data) => toastr.error(data.data));
    }

    private onRepoUpdate(value, isNewRepository) {
        this.repository = value;
        this.isNewRepository = isNewRepository;
    }

    private buildvariantUpdated(model) {
        console.log(model);
    }

}

/**
 * @ngdoc directive
 * @name moliorApp.components.repository.form.directive:repositoryForm
 * @description
 * Is a wrapper around {@link moliorApp.components.repository.form.create.directive:repositoryCreateForm Repository Create Component}
 * Handles the communication between those components.
 *
 * @restrict 'E'
 *
 * @param {Object} ngModel The model which gets binded
 * @param {Object} project The current project
 * @param {Version} version The current version
 */
export const RepositoryFormComponent = {
    template: `
<div class="repository-form">
  <!-- Title Toolbar -->
  <md-toolbar>
    <div class="md-toolbar-tools">
      <h2>Repository</h2>
      <span flex></span>
      <md-button aria-label="Close Repository Form" class="md-icon-button" ng-click="$ctrl.cancel()">
        <ng-md-icon icon="close" style="fill:rgba(255,255,255,0.87);" />
      </md-button>
    </div>
  </md-toolbar>
  <!-- Content -->
  <form layout-margin layout="column">
    <md-stepper id="repository-form-stepper" md-linear="$ctrl.isStepperLinear" ng-init="$ctrl.isStepperLinear = true">
      <!-- Repository Step -->
      <md-step md-label="Repository">
        <md-step-body layout-padding>
          <section layout="column">
            <h3>Repository</h3>
            <repository-metadata-form url="$ctrl.repository.url" version="$ctrl.version" on-update="$ctrl.onRepoUpdate(value, isNewRepository)"></repository-metadata-form>
            <md-step-actions layout-align="end end" layout="row">
              <md-button class="md-primary" ng-click="$ctrl.cancel()">Cancel</md-button>
              <md-button ng-disabled="!$ctrl.repository || ($ctrl.newRepository === true && !$ctrl.repository.url)" class="md-primary md-raised" ng-click="$ctrl.openBuildOptionsStep()">Continue</md-button>
            </md-step-actions>
          </section>
        </md-step-body>
      </md-step>
      <md-step md-label="Build Options">
        <md-step-body layout-padding>
          <section layout="column">
            <h3>Build Options</h3>
              <error ng-if="$ctrl.allowedBuildsOptions.length === 0">
              The projectversion does not have any buildvariants defined. Please contact an administrator!
              </error>
              <buildvariant-picker ng-model="$ctrl.repository.buildvariants" ng-if="$ctrl.allowedBuildsOptions.length > 0" allowed-build-options="$ctrl.allowedBuildsOptions"
                ng-basemirrors="$ctrl.basemirrors" ng-architectures="$ctrl.architectures" on-update="$ctrl.buildvariantUpdated(model)"></buildvariant-picker>
              <md-step-actions layout-align="end end" layout="row">
                <md-button class="md-primary" ng-click="$ctrl.previousStep()">Back</md-button>
                <md-button ng-disabled="$ctrl.repositories.buildvariants.length === 0" class="md-primary md-raised" ng-click="$ctrl.openConfirmationStep()">Continue</md-button>
              </md-step-actions>
          </section>
        </md-step-body>
      </md-step>
    <md-step md-label="Confirmation">
        <md-step-body layout-padding>
          <repository-confirmation repository="$ctrl.repository" architectures="$ctrl.architectures" basemirrors="$ctrl.basemirrors"></repository-confirmation>
          <md-step-actions layout-align="end end" layout="row">
            <md-button class="md-primary" ng-click="$ctrl.previousStep()">Back</md-button>
            <md-button class="md-primary md-raised" ng-click="$ctrl.confirm()">Confirm</md-button>
          </md-step-actions>
        </md-step-body>
      </md-step>
    </md-stepper>
  </form>
</div>
    `,
    controller: RepositoryFormController,
    bindings: {
        ngModel: '<',
        project: '<',
        version: '<',
    },
};
