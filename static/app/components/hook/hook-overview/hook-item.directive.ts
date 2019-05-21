import * as toastr from 'toastr';
import { IRootScopeService } from 'angular';
import { StateService } from '@uirouter/core';
import { WebhookService } from '../webhook.service';
import angular = require('angular');

// tslint:disable-next-line:no-var-requires
const template = require('./hook-item.tmp.html');

/**
 * Represents a hook item
 */
class HookItemController {
    private hook: any;
    constructor(
        private $scope: IRootScopeService,
        private $mdDialog: any,
        private $state: StateService,
        private WebhookService: WebhookService,
    ) {
        this.$scope = $scope;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.WebhookService = WebhookService;
    }

    /**
     * Initializes this hook item
     */
    public $onInit() {
        this.hook = this.hook;
    }

    /**
     * Toggles the hook's enabled flag
     */
    private toggleHook() {
        this.WebhookService.put(
            this.hook.id, {enabled: !this.hook.enabled})
            .then((data) => toastr.success(data))
            .catch((data) => toastr.error(`Cannot update hook : ${data}`));
    }

    /**
     * Deletes the hook
     */
    private deleteHook(ev) {
        const confirm = this.$mdDialog.confirm()
            .title('Remove hook: ' + this.hook.url)
            .textContent('Do you really want to remove this hook?')
            .ariaLabel('remove hook')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        this.$mdDialog
            .show(confirm)
            .then(() => {
                this.WebhookService
                    .remove(this.hook.id)
                    .then(() => this.$state.reload(this.$state.current.name))
                    .catch((response) => toastr.error(response.data));
            });
    }

    private saveHook(hook) {
        return this.WebhookService
            .put(hook.id, hook)
            .then(() => this.$mdDialog.hide())
            .catch((response) => {
                toastr.error(response.data);
            });
    }

    private editHook(ev) {
        const $ctrl = this;
        const controller = function() {
            this.parent = $ctrl;
        };

        this.$mdDialog
            .show({
                template: `<hook-form hook="$ctrl.parent.hook" on-update="$ctrl.parent.saveHook(value)"></hook-form>`,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                controller,
                controllerAs: '$ctrl',
            });

    }

    /**
     *  Opens the hook options menu
     */
    private openOptionsMenu($mdOpenMenu, $event) {
        $event.stopPropagation();
        $mdOpenMenu($event);
    }
}

/**
 * Represents one hook item in the Hook Overview table.
 * @param {Hook} hook The hook to represent
 */
export const HookItemDirective = () => {
    return {
        templateUrl: template,
        restrict: 'A',
        controller: HookItemController,
        controllerAs: '$ctrl',
        bindToController: true,
        replace: true,
        scope: {
            hook: '<',
        },
    };
};
