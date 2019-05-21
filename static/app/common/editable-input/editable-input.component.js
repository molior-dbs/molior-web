import './editable-input.style.scss';

// @ts-ignore
import template from './editable-input.tmp.html';

/**
 * @ngdoc controller
 * @name moliorApp.common.editableInput.controller:EditableInputController
 * @description
 * The information detail view of a project version.
 *
 */
export class EditableInputController {} 

/**
 * @ngdoc directive
 * @name moliorApp.common.editableInput.directive:editableInput
 * @description
 * The project version detail view.
 * @restrict 'E'
 *
 * @param {string} ngModel The model which should get binded
 * @param {string} isDisabled If the control is disabled
 * @param {function} onChanges When the input changes
 */
export const EditableInputComponent = {
    templateUrl: template,
    controller: EditableInputController,
    bindings: {
        'ngModel': '<',
        'isDisabled': '<',
        'onChanges': '&'
    }
};