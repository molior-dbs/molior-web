import * as angular from 'angular';
import * as toastr from 'toastr';
import { WebhookService } from '@molior/components/hook/webhook.service';
import { StateService } from '@uirouter/core';

/**
 * Button to add a new hook to a repository
 */
export class AddRepositoryHookController {
    private repository: any;
    constructor(
        private $mdDialog: any,
        private WebhookService: WebhookService,
        private $state: StateService,
    ) { }

    public saveHook(hook) {
        hook.repository_id = this.repository.id;
        return this.WebhookService
            .post(hook)
            .then(() => {
                this.$mdDialog.hide();
                this.$state.go(this.$state.$current);
            })
            .catch((response) => {
                toastr.error(response.data);
            });
    }

    public openHookForm() {
        const $ctrl = this;
        const controller = function() {
            this.parent = $ctrl;
        };

        this.$mdDialog
            .show({
                template: `
<hook-form on-update="$ctrl.parent.saveHook(value)"></hook-form>
                `,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
                controller,
                controllerAs: '$ctrl',
            });
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.repository.detail.directive:addRepositoryHook
 * @description
 * Button to add a new hook to a repository
 * @restrict 'E'
 *
 */
export const AddRepositoryHookComponent = {
    template: `
<md-button class="md-primary md-raised" ng-click="$ctrl.openHookForm()">
Add Webhook
</md-button>
    `,
    controller: AddRepositoryHookController,
    bindings: {
        repository: '<',
    },
};
