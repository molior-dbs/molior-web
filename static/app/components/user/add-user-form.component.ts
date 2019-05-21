import { User } from './interfaces';
import { UserService } from './user.service';
import { StateService } from '@uirouter/core';
import { Notify } from '@molior/common/notify/notify.service';

/**
 * Controller for a user overview. Used in
 */
class AddUserFormController {
    public onSave: ({ value }) => void;
    private ngModel: User = {} as User;

    constructor(
        private $mdDialog,
        private $mdToast,
        private Notify: Notify,
        private $state: StateService,
        private UserService: UserService,
    ) { }

    public async save(user: User) {
        try {
            await this.UserService.add(user);
            this.$state.reload();
        } catch (error) {
            this.$mdToast.show(this.Notify.notify(error.data || error.message || error.statusText));
        }
    }
}

/**
 * This component displays an overview of users.
 *
 * @restrict 'E'
 * @example
 * <pre>
 *    <user-overview></user-overview>
 * </pre>
 */
export const AddUserFormComponent = {
    template: `
<section class="project-version-form">
    <!-- Toolbar -->
    <md-toolbar layout="row" layout-align="center center">
        <div class="md-toolbar-tools">New User</div>
        <!-- Close -->
        <md-button aria-label="Close new user form" class="md-icon-button" ng-click="$ctrl.$mdDialog.cancel()">
            <ng-md-icon icon="close" />
        </md-button>
    </md-toolbar>

    <form layout-padding ng-submit="$ctrl.save($ctrl.ngModel)">
        <!-- Form Content -->
        <section layout="column">
            <div>
                <h3>Username</h3>
                <md-autocomplete md-items="i in []" required md-search-text="$ctrl.ngModel.name"></md-autocomplete>
            </div>
            <div>
                <h3>Password</h3>
                <div class="input-password-wrapper">
                    <input type="password" readonly onfocus="this.removeAttribute('readonly');" required ng-model="$ctrl.ngModel.password"></input>
                </div>
            </div>
            <div>
                <h3>Email</h3>
                <md-autocomplete md-items="i in []" required md-search-text="$ctrl.ngModel.email"></md-autocomplete>
            </div>
        </section>

        <!-- Buttons -->
        <div layout="row">
            <span flex></span>
            <md-button class="md-cancel md-primary" ng-click="$ctrl.$mdDialog.cancel()">CANCEL</md-button>
            <md-button class="md-primary" type="submit"> SAVE</md-button>
        </div>
    </form>
</section>
    `,
    controller: AddUserFormController,
};
