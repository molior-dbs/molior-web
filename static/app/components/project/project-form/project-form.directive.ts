// tslint:disable-next-line:no-var-requires
const template = require('./project-form.tmp.html');

/**
 * @ngdoc controller
 * @name moliorApp.components.project.controller:ProjectFormController
 * @description
 *
 */
export class ProjectFormController {
    public onUpdate: any;
    public ngModel: any;

    constructor() {
        this.onUpdate = this.onUpdate;
        this.ngModel = this.ngModel || {};
    }
    /**
     * @ngdoc
     * @name moliorApp.components.project.controller:ProjectFormController#saveProject
     * @methodOf moliorApp.components.project.controller:ProjectFormController
     *
     * @description
     * Saves the bound project
     *
     * @example
     * <pre>
     * ProjectFormController.saveProject();
     * </pre>
     */
    public saveProject() {
        this.onUpdate({
            value: this.ngModel,
        });
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.project.directive:projectForm
 * @description
 * Directive which represents a form to create a project.
 * This directive does not use the MoliorService to create anything.
 * You must build a wrapper around this directive, to create the project.
 * You can use onUpdate to listen to project updates.
 *
 * @param {Object} ngModel (optional) The data, which get binded to the controller
 * @param {Function} onUpdate Gets called when the user submits the form. The data will be sent a first parameter, with the name "value"
 *
 * @example
 *   <example module="moliorApp">
 *       <file name="index.html">
 *       <div ng-controller="FormController">
 *           <div ng-bind="newProjectName"></div>
 *           <project-form ng-model="project" on-update="onUpdate(value)" on-close="onClose()"></project-form>
 *       </div>
 *       </file>
 *       <file name="script.js">
 *           angular
 *           .module('moliorApp', [])
 *           .controller('FormController', function($scope) {
 *               $scope.newProjectName = '';
 *               $scope.ngModel = {
 *                   'name': 'Project Name 123';
 *               };
 *
 *               $scope.onUpdate = function(newProject) {
 *                   $scope.newProjectName = newProject.name;
 *               }
 *               $scope.onClose = function() {
 *                   prompt('Are you sure?');s
 *               }
 *           });
 *       </file>
 *       </example>
 *   * @restrict 'E'
 */
export const ProjectFormDirective = () => {
    return {
        templateUrl: template,
        bindToController: true,
        controller: ProjectFormController,
        controllerAs: '$ctrl',
        transclude: true,
        scope: {
            ngModel: '=?',
            onUpdate: '&',
            onClose: '&',
        },
        restrict: 'E',
    };
};
