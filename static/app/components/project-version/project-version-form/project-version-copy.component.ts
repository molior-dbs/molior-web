import { ProjectVersionService } from '../project-version.service';
import { IComponentOptions } from 'angular';
import { Notify } from '@molior/common/notify/notify.service';

/**
 * Represents the controller for the ProjectVersionForm component.
 */
export class ProjectVersionCopyController {
    public onSave: ({ value: ProjectVersionCreateResponse }) => void;

    private name: string;
    private projectVersionId: number;
    private action: string;

    private actions = {
        overlay: {
            action: async (id: number, name: string) => await this.ProjectVersionService.createOverlay(id, name),
            name: 'Create overlay of ',
        },
        copy: {
            action: async (id: number, name: string) => await this.ProjectVersionService.copy(id, name),
            name: 'Copy ',
        },
    };

    constructor(
        private ProjectVersionService: ProjectVersionService,
        private Notify: Notify,
        private $mdToast,
        public $mdDialog,
    ) { }

    public $onInit() {
        this.action = this.action;
    }

    /**
     * Saves the new version
     */
    public async save() {
        try {
            const response = await this.actions[this.action].action(this.projectVersionId, this.name);
            this.$mdToast.show(this.Notify.notify('Version successfully created'));
            this.onSave({ value: response });
        } catch (error) {
            this.$mdToast.show(this.Notify.notify(error.data || error.message || error.statusText));
        }
    }
}

/**
 * Represents the form to create a project version.
 *
 * @param {Function} onSave Callback when the user successfully submits the form.
 * @param {Object} ngModel The model, which should get bound to the form
 * @param {Object} project The project, which the version depends on
 */
export const ProjectVersionCopyComponent: IComponentOptions = {
    bindings: {
        onSave: '&',
        action: '@',
        projectVersionId: '<',
    },
    template: `
<section class="project-version-form">
    <!-- Toolbar -->
    <md-toolbar layout="row" layout-align="center center">
        <div class="md-toolbar-tools">{{ $ctrl.actions[$ctrl.action].name }} Version</div>
        <!-- Close -->
        <md-button aria-label="Close Projectversion form" class="md-icon-button" ng-click="$ctrl.$mdDialog.cancel()">
            <ng-md-icon icon="close" />
        </md-button>
    </md-toolbar>

    <form layout-padding ng-submit="$ctrl.save(this.name)">
        <!-- Form Content -->
        <section layout="column">
            <div>
                <h3>Version name</h3>
                <md-autocomplete md-items="i in []" required md-search-text="$ctrl.name"></md-autocomplete>
            </div>
        </section>

        <!-- Buttons -->
        <div layout="row">
            <span flex></span>
            <md-button class="md-cancel md-primary" ng-click="$ctrl.$mdDialog.cancel()">CANCEL</md-button>
            <md-button class="md-primary" type="submit"> SAVE</md-button>
        </div>
    </form>
</section>`,
    controller: ProjectVersionCopyController,
};
