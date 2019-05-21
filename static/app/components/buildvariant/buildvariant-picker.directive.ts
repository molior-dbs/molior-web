import './buildvariant-picker.style.scss';
import { IDirectiveFactory } from 'angular';

// tslint:disable-next-line:no-var-requires
const template = require('./buildvariant-picker.tmp.html');

export class BuildvariantPickerController {
    public onUpdate: any;
    private ngModel: any;
    private isDisabled: boolean;
    private disabled: boolean;
    private isLoading: boolean;
    private hideDisabledRow: boolean;
    private allowedBuildOptions: any;
    private ngBasemirrors: any;
    private ngArchitectures: any;
    private allowedOptions: any;
    private basemirrors: any;
    private architectures: any;

    constructor(
        private $scope: angular.IRootScopeService,
    ) { }

    public $onInit() {
        this.ngModel = this.ngModel || [];
        this.isDisabled = this.disabled;
        this.isLoading = true;
        this.hideDisabledRow = this.hideDisabledRow;

        this.$scope.$watchCollection(() => this.allowedBuildOptions, () => this.update());

        this.$scope.$watchCollection(() => this.ngBasemirrors, () => {
            this.isLoading = this.ngBasemirrors === undefined;
            this.update();
        });

        this.$scope.$watchCollection(() => this.ngArchitectures, () => {
            this.isLoading = this.ngArchitectures === undefined;
            this.update();
        });

        this.$scope.$watchCollection(
            () => this.ngModel,
            () => this.onUpdate({ value: this.ngModel }),
        );
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#getAllowedBasemirrors
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Returns a list of allowed basemirrors. Depends on allowedBuildOptions parameter.
     *
     * @param {Object[]} basemirrors The full list of basemirrors
     *
     *
     * @returns {Object[]} List of allowed basemirrors. Depends on allowedBuildOptions parameter.
     * @example
     * <pre>
     *  $ctrl.getAllowedBasemirrors([{ name: 'wheezy', id: 1}]);
     * </pre>
     */
    private getAllowedBasemirrors(basemirrors) {
        if (!this.ngBasemirrors) {
            return [];
        }
        return basemirrors.filter((basemirror) =>
            this.allowedOptions.filter((option) => option.basemirrorId === basemirror.id).length,
        );
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#getAllowedArchitectures
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Returns a list of allowed architectures. Depends on allowedBuildOptions parameter.
     *
     * @param {Object[]} architectures The full list of architectures
     *
     *
     * @returns {Object[]} List of allowed architectures. Depends on allowedBuildOptions parameter.
     * @example
     * <pre>
     *  $ctrl.getAllowedArchitectures([{ name: 'amd64', id: 1}]);
     * </pre>
     */
    private getAllowedArchitectures(architectures) {
        if (this.ngArchitectures === undefined) {
            return [];
        }
        return architectures.filter((architecture) =>
            this.allowedOptions.filter((option) => option.architectureId === architecture.id).length,
        );
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#isFieldDisabled
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Checks if the field is disabled. Depends on allowedBuildOptions Parameter
     *
     * @param {Number} architectureId The architecture to deselect
     * @param {Number} basemirrorId The basemirror to deselect
     *
     * @returns {Boolean} Whether the field is allowed or not
     * @example
     * <pre>
     *  $ctrl.isFieldDisabled(1, 1);
     * </pre>
     */
    private isFieldDisabled(architectureId, basemirrorId) {
        if (!this.allowedOptions.length) {
            return false;
        } else {
            return this.allowedOptions
                .filter((option) =>
                    option.architectureId === architectureId && option.basemirrorId === basemirrorId)
                .length === 0;
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#removeSelection
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Deselects the given combination, if it is not already deselected
     *
     * @param {Number} architectureId The architecture to deselect
     * @param {Number} basemirrorId The basemirror to deselect
     *
     * @example
     * <pre>
     *  $ctrl.removeSelection(1, 1);
     * </pre>
     */
    private removeSelection(architectureId, basemirrorId) {
        for (let i = 0; i < this.ngModel.length; i++) {
            if (this.ngModel[i].architectureId === architectureId &&
                this.ngModel[i].basemirrorId === basemirrorId) {
                this.ngModel.splice(i, 1);
                break;
            }
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#addSelection
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Selects the given combination, if it is not already selected
     *
     * @param {Number} architectureId The architecture to select
     * @param {Number} basemirrorId The basemirror to select
     *
     * @example
     * <pre>
     *  $ctrl.addSelection(1, 1);
     * </pre>
     */
    private addSelection(architectureId, basemirrorId) {
        if (!this.isSelected(architectureId, basemirrorId)) {
            this.ngModel.push({
                architectureId,
                basemirrorId,
            });
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#isSelected
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Checks if the given combination is selected
     *
     * @param {Number} architectureId The architecture to check
     * @param {Number} basemirrorId The basemirror to check
     *
     * @returns {Boolean} Whether the combination is selected or not
     *
     * @example
     * <pre>
     *  $ctrl.isSelected(1, 1);
     * </pre>
     */
    private isSelected(architectureId, basemirrorId) {
        return this.ngModel.filter((value) =>
            value.architectureId === architectureId &&
            value.basemirrorId === basemirrorId).length > 0;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#toggle
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Toggles the field with the given architectureId and basemirrorId
     *
     * @param {Number} architectureId The architecture to select
     * @param {Number} basemirrorId The basemirror to select
     *
     *
     * @example
     * <pre>
     *  $ctrl.toggle(1, 1);
     * </pre>
     */
    private toggle(architectureId, basemirrorId) {
        if (this.isSelected(architectureId, basemirrorId)) {
            this.removeSelection(architectureId, basemirrorId);
        } else {
            this.addSelection(architectureId, basemirrorId);
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#areAllArchitecturesSelected
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Checks if all the enabled architectures of the given id are selected
     *
     * @param {Number} architectureId The architecture id which should get checked
     *
     * @returns {Boolean} If all architectures are selected or not
     *
     * @example
     * <pre>
     *  $ctrl.areAllArchitecturesSelected(1);
     * </pre>
     */
    private areAllArchitecturesSelected(architectureId) {
        const enabledBasemirrorsOfArchitectureRow =
            this.basemirrors.filter((value) => !this.isFieldDisabled(value.id, value.id));

        const selectedBasemirrorsOfArchitectureRow = this.ngModel.filter((value) =>
            value.architectureId === architectureId &&
            this.isSelected(architectureId, value.basemirrorId) &&
            !this.isFieldDisabled(architectureId, value.basemirrorId),
        );

        return selectedBasemirrorsOfArchitectureRow.length === enabledBasemirrorsOfArchitectureRow.length;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#areAllBasemirrorsSelected
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Checks if all the enabled basemirrors of the given id are selected
     *
     * @param {Number} basemirrorId The basemirror id which should get checked
     *
     * @returns {Boolean} If all basemirrors are selected or not
     *
     * @example
     * <pre>
     *  $ctrl.areAllBasemirrorsSelected(1);
     * </pre>
     */
    private areAllBasemirrorsSelected(basemirrorId) {
        const enabledArchitecturesOfBasemirrorRow = this.architectures
            .filter((value) => !this.isFieldDisabled(value.id, basemirrorId));

        const selectedArchitecturesOfBasemirrorRow = this.ngModel.filter((value) =>
            value.basemirrorId === basemirrorId &&
            this.isSelected(value.architectureId, basemirrorId) &&
            !this.isFieldDisabled(value.architectureId, basemirrorId));

        return selectedArchitecturesOfBasemirrorRow.length === enabledArchitecturesOfBasemirrorRow.length;
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#toggleArchitectures
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Toggles the selection of all the architectures with the given Id
     *
     * @param {Number} architectureId The id of the architecture, which should get toggled
     * @example
     * <pre>
     *  $ctrl.toggleArchitectures(1);
     * </pre>
     */
    private toggleArchitectures(architectureId) {
        if (this.areAllArchitecturesSelected(architectureId)) {
            this.basemirrors.forEach((basemirror) => this.removeSelection(architectureId, basemirror.id));
        } else {
            this.basemirrors.forEach((basemirror) => {
                if (!this.isFieldDisabled(architectureId, basemirror.id)) {
                    this.addSelection(architectureId, basemirror.id);
                }
            });
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#toggleBasemirrors
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Toggles the selection of all the basemirrors with the given Id
     *
     * @param {Number} basemirrorId The id of the basemirror, which should get toggled
     * @example
     * <pre>
     *  $ctrl.toggleBasemirrors(1);
     * </pre>
     */
    private toggleBasemirrors(basemirrorId) {
        if (this.areAllBasemirrorsSelected(basemirrorId)) {
            this.architectures.forEach((architecture) => this.removeSelection(architecture.id, basemirrorId));
        } else {
            this.architectures.forEach((architecture) => {
                if (!this.isFieldDisabled(architecture.id, basemirrorId)) {
                    this.addSelection(architecture.id, basemirrorId);
                }
            });
        }
    }

    private mapBasemirrors(basemirrors) {
        if (!basemirrors) {
            return [];
        }
        return basemirrors
            .map((basemirror) =>
                ({ id: basemirror.id, name: `${basemirror.project.name}-${basemirror.name}` }));
    }

    /**
     * @ngdoc
     * @name moliorApp.components.buildvariant.controller:BuildvariantPickerController#update
     * @methodOf moliorApp.components.buildvariant.controller:BuildvariantPickerController
     *
     * @description
     * Updates the bound basemirrors and architectures.
     *
     * @example
     * <pre>
     *     BuildvariantPickerController.update();
     * </pre>
     */
    private update() {
        this.allowedOptions = this.allowedBuildOptions || [];

        if (this.allowedOptions.length && this.hideDisabledRow === true) {
            this.basemirrors = this.getAllowedBasemirrors(this.ngBasemirrors);
            this.architectures = this.getAllowedArchitectures(this.ngArchitectures);
        } else {
            this.basemirrors = this.ngBasemirrors;
            this.architectures = this.ngArchitectures;
        }
        this.basemirrors = this.mapBasemirrors(this.basemirrors);
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.buildvariant.directive:buildvariantPicker
 * @description
 * # Buildvariant Picker
 * This directive serves as a matrix selection for
 * build variants.
 *
 * <img src="assets/img/build-options-input.png" />
 *
 *
 * @restrict 'E'
 *
 * @param {Object[]} ngArchitectures Array of architectures
 * @param {Object[]} ngBasemirrors Array of basemirrors
 * @param {Object[]} ngModel The selected values of the input
 * @param {Boolean} disabled Whether the input should be disabled or not
 * @param {Object[]} allowedBuildOptions A list of allowed build options
 * @param {Function} onUpdate Gets called when the user changes the buildoptions
 * @param {Boolean} hideDisabledRow True if you want to hide a row, if all its members are not allowed.
 *
 * @example
 * <pre>
 *  <script>
 *      $ctrl.architectures = [
 *          {
 *              id: 1,
 *              name: 'amd64'
 *          }
 *      ];
 *      $ctrl.basemirrors = [
 *          {
 *              id: 1,
 *              name: 'jessie-8.8'
 *          }
 *      ];
 *      $ctrl.selectedValues = [
 *          {
 *              basemirrorId: 1,
 *              architectureId: 1
 *          }
 *      ];
 *
 *      $ctrl.allowedBuildOptions = [
 *          {
 *              basemirrorId: 1,
 *              architectureId: 1
 *          },
 *          {
 *              basemirrorId: 1,
 *              architectureId: 2
 *          }
 *      ];
 *
 *      $ctrl.onUpdate(buildOptions) = function() {
 *          console.log('All buildOptions:', buildOptions);
 *      };
 *  </script>
 *  <buildvariant-picker hide-disabled-row="false" on-update="$ctrl.onUpdate(value)" disabled="true" ng-basemirrors="$ctrl.basemirrors" ng-architectures="$ctrl.architectures" ng-model="$ctrl.selectedValues"></buildvariant-picker>
 * </pre>
 */
export const BuildvariantPickerDirective: IDirectiveFactory = () => {
    return {
        bindToController: true,
        controller: BuildvariantPickerController,
        controllerAs: '$ctrl',
        replace: true,
        templateUrl: template,
        restrict: 'E',
        scope: {
            ngBasemirrors: '=',
            ngArchitectures: '=',
            ngModel: '=?',
            disabled: '@?',
            allowedBuildOptions: '=?',
            onUpdate: '&',
            hideDisabledRow: '@?',
        },
    };
};
