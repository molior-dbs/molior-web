import * as toastr from 'toastr';
import { UserService } from '../user/user.service';
import { UserRoleService } from './user-role.service';

// tslint:disable-next-line:no-var-requires
const template = require('./user-form.tmp.html');

/**
 * @description
 * The controller to add a user to a role.
 */
class UserFormController {
    private query: {
        name: string;
        nameSearch: string;
        namesMatching: any[];
        nameId: number;
        role: any; // default role
    };
    private project: any;

    constructor(
        private UserRoleService: UserRoleService,
        private UserService: UserService,
        private $stateParams: any,
        private $mdDialog: any,
        private $q: any,
    ) {  }

    /**
     * Initializes the component and loads UserRoles
     */
    public $onInit() {
        this.query = {
            name: '',
            nameSearch: '',
            namesMatching: [],
            nameId: -1,
            role: null, // default role
        };
    }

    /**
     * Cancels a the current dialog
     */
    public cancel() {
        this.$mdDialog.cancel();
    }

    /**
     * Adds the bound user to the bound role
     *
     * @example
     * <pre>
     * $ctrl.query = {
     *     'nameId': 1,
     *     'role': 'member'
     * }
     * $ctrl.add();
     * </pre>
     */
    public add() {
        const deferred = this.$q.defer();
        if (this.query.nameId > 0) {
            this.UserRoleService
                .put(this.project.id, this.query.nameId, this.query.role)
                .then((data) => {
                    toastr.success(data.result);
                    this.$mdDialog.hide();
                    deferred.resolve(data);
                })
                .catch((data) => {
                    toastr.error('Cannot set role : ' + data.data);
                    deferred.reject(data);
                });
            return deferred.promise;
        }
        return this.$mdDialog.hide();
    }

    /**
     * Searches users with the bound filters applied and returns it in the promise.
     *
     * @example
     * <pre>
     *    $ctrl.qery.nameSearch = 'a';
     *    $ctrl.UserSearch();
     * </pre>
     *
     * @returns {Promise} Returns the $http promise
     */
    public UserSearch() {
        const deferred = this.$q.defer();
        this.UserService
            .all({
                page: 1,
                page_size: 10,
                q: this.query.nameSearch,
            })
            .then((results) => deferred.resolve(results.results))
            .catch(deferred.reject);
        return deferred.promise;
    }

    /**
     * @description
     * Set the `nameId` of the controller to the given item.id.
     * When the given item is undefined, it will set the `nameId` to -1
     */
    public selectedItemChange(item) {
        if (item) {
            this.query.nameId = item.id;
        } else {
            this.query.nameId = -1;
        }
    }
}

/**
 * This component displays a formular to add a user with a role
 * to a project
 *
 * @restrict 'E'
 */
export const UserFormComponent = {
    templateUrl: template,
    controller: UserFormController,
    bindings: {
        project: '<',
        userRoles: '<',
    },
};
