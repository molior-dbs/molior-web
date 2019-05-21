import './project-version-form.style.scss';

import { ProjectVersionService } from '../project-version.service';
import { ArchitectureService } from '@molior/components/architecture/architecture.service';
import { ProjectVersionDetail, ProjectVersionCreate, ProjectVersionCreateResponse } from '../interfaces';
import { Architecture } from '@molior/components/architecture/interfaces';
import { MoliorApiResponse } from '@molior/core';
import { IComponentOptions } from 'angular';
import { Notify } from '@molior/common/notify/notify.service';

/**
 * Represents the controller for the ProjectVersionForm component.
 */
export class ProjectVersionFormController {
    public onSave: ({ value: ProjectVersionCreateResponse }) => void;
    private architectures: Architecture[];
    private basemirrors: ProjectVersionDetail[];
    private ngModel: ProjectVersionCreate = {} as ProjectVersionCreate;
    private projectId: number;

    constructor(
        private ProjectVersionService: ProjectVersionService,
        private ArchitectureService: ArchitectureService,
        private Notify: Notify,
        private $mdToast,
        public $mdDialog,
    ) { }

    /**
     * Initializes the controller and loads the needed data
     */
    public $onInit() {
        this.load();
    }

    /**
     * Saves the ngModel
     */
    public async save() {
        try {
            const response = await this.ProjectVersionService.create(this.projectId, this.ngModel);
            this.$mdToast.show(this.Notify.notify('Version successfully created'));
            this.onSave({ value: response });
        } catch (error) {
            this.$mdToast.show(this.Notify.notify(error.data || error.message || error.statusText));
        }
    }

    /**
     * Loads the needed data for the controller and
     * binds it to it
     */
    public async load() {
        // Load architectures and basemirror simultaneously
        const toLoad: Array<Promise<MoliorApiResponse<any>>> = [
            this.ArchitectureService.all(),
            this.ProjectVersionService.all({ isbasemirror: true }),
        ];

        // Resolve all promises
        const [architectures, basemirrors] = await Promise.all(toLoad);

        this.architectures = architectures.results;
        this.basemirrors = basemirrors.results;
    }
}

/**
 * Represents the form to create a project version.
 *
 * @param {Function} onSave Callback when the user successfully submits the form.
 * @param {Object} ngModel The model, which should get bound to the form
 * @param {Object} project The project, which the version depends on
 */
export const ProjectVersionFormComponent: IComponentOptions = {
    bindings: {
        onSave: '&',
        ngModel: '<?',
        projectId: '<',
    },
    template: `
<section class="project-version-form">
    <!-- Toolbar -->
    <md-toolbar layout="row" layout-align="center center">
        <div class="md-toolbar-tools">New Version</div>
        <!-- Close -->
        <md-button aria-label="Close Projectversion form" class="md-icon-button" ng-click="$ctrl.$mdDialog.cancel()">
            <ng-md-icon icon="close" />
        </md-button>
    </md-toolbar>

    <form layout-padding ng-submit="$ctrl.save(this.ngModel)">
        <!-- Form Content -->
        <section layout="column">
            <div>
                <h3>Version</h3>
                <md-autocomplete md-items="i in []" required md-search-text="$ctrl.ngModel.name"></md-autocomplete>
            </div>
            <div>
                <h3>Basemirror</h3>
                <md-select required style="min-width: 300px" ng-model="$ctrl.ngModel.basemirror">
                    <md-option aria-label="List of Basemirrors" ng-repeat="basemirror in $ctrl.basemirrors" ng-value="basemirror.project.name + '/' + basemirror.name">
                        {{ basemirror.project.name }} / {{ basemirror.name }}
                    </md-option>
                </md-select>
            </div>
            <div>
                <h3>Architectures</h3>
                <md-select multiple required aria-label="List of architectures" style="min-width: 300px" ng-model="$ctrl.ngModel.architectures">
                    <md-option ng-repeat="architecture in $ctrl.architectures" ng-value="architecture.name">
                        {{ architecture.name }}
                    </md-option>
                </md-select>
            </div>
        </section>

        <!-- Buttons -->
        <div layout="row">
            <span flex></span>
            <md-button class="md-cancel md-primary" ng-click="$ctrl.$mdDialog.cancel()">CANCEL</md-button>
            <md-button ng-disabled="!$ctrl.ngModel.name || !$ctrl.ngModel.basemirror || !$ctrl.ngModel.architectures" class="md-primary" type="submit"> SAVE</md-button>
        </div>
    </form>
</section>`,
    controller: ProjectVersionFormController,
};
