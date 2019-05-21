import './project-creation-form.style.scss';

import * as toastr from 'toastr';
import { ProjectService } from '../project.service';
import { StateService } from '@uirouter/core';
import { ProjectDetail, ProjectOverviewItem } from '../interfaces';
import { IComponentOptions } from 'angular';

class ProjectCreationFormController {

    private project: any;
    private version: any;

    public constructor(
        private ProjectService: ProjectService,
        private $mdDialog: any,
        private $state: StateService,
    ) { }

    public async save(project) {
        try {
            await this.ProjectService.post(this.project);
            toastr.success('Successfully created the project');
            this.$mdDialog.hide();
            this.$state.go('project-overview');
        } catch (err) {
            toastr.error(err.data);
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.project.creation.controller:ProjectCreationFormController#isFormEdited
     * @methodOf moliorApp.components.project.creation.controller:ProjectCreationFormController
     *
     * @description
     * Checks if the form got edited by the user
     *
     * @returns {Boolean} If the form got edited by the user
     * @example
     * <pre>
     *     this.isFormEdited();
     * </pre>
     */
    public isFormEdited() {
        return (this.project && this.project.name) ||
            this.version && (
                this.version.name ||
                (this.version.dependencies && this.version.dependencies.length) ||
                (this.version.buildOptions && this.version.buildOptions.length)
            );
    }

    /**
     * @ngdoc
     * @name moliorApp.components.project.creation.controller:ProjectCreationFormController#cancel
     * @methodOf moliorApp.components.project.creation.controller:ProjectCreationFormController
     *
     * @description
     * Cancels the current dialog using $mdDialog
     *
     * @example
     * <pre>
     *     this.cancel();
     * </pre>
     */
    public cancel() {
        if (this.isFormEdited()) {
            if (confirm('Are you sure? The data will be lost.')) {
                this.$mdDialog.cancel();
            }
        } else {
            this.$mdDialog.cancel();
        }
    }

}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.creation.directive:projectCreationForm
 * @description
 * Component for project creations. This component
 * is a wrapper for {@link moliorApp.components.project.directive:projectForm ProjectForm Directive} and {@link moliorApp.components.project.version.directive:projectVersionForm ProjectVersionForm Directive}.
 *
 * @restrict 'E'
 */
export const ProjectCreationFormComponent: IComponentOptions = {
    template: `
<project-form on-update="$ctrl.save($ctrl.project)" on-close="$ctrl.cancel()" ng-model="$ctrl.project">
    <md-button class="md-cancel md-warn" ng-click="$ctrl.cancel()">CANCEL</md-button>
    <md-button type="submit" ng-disabled="$ctrl.isLoading || !$ctrl.project" class="md-cancel md-primary">SAVE</md-button>
</project-form>
    `,
    controller: ProjectCreationFormController,
};
