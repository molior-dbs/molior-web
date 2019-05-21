import * as angular from 'angular';
import * as toastr from 'toastr';

// tslint:disable-next-line:no-var-requires
const template = require('./mirror-overview.tmp.html');
import { MirrorService } from './mirror.service';
import { StateService, StateParams } from '@uirouter/core';
import { ProjectVersionService } from '../project-version/project-version.service';
import { MoliorApiResponse } from '@molior/core';
import { MirrorItem } from './interfaces';

/**
 * Handles the mirror overview and creation functionality.
 */
class MirrorOverviewController {
    public query;
    public mirror: MoliorApiResponse<MirrorItem[]>;
    constructor(
        private MirrorService: MirrorService,
        private $mdDialog,
        private $state: StateService,
        private $stateParams: StateParams,
        private $scope: angular.IScope,
        private ProjectVersionService: ProjectVersionService) {
        this.$scope.load = () => this.load();
    }

    /**
     * Initializes the component
     */
    public $onInit() {
        this.$scope.$watchCollection('$ctrl.query', () => this.updateURL());
        this.load();
    }

    /**
     * Page data initialisation
     */
    public async load() {
        this.mirror = await this.MirrorService
            .all({
                page: this.query.page - 1,
                page_size: this.query.pageSize,
                q: this.query.filter_name,
            });
        this.$scope.$apply();
    }

    /**
     * Opens the mirror detail menu
     */
    public openMirrorDetailMenu($mdOpenMenu, $event) {
        $event.stopPropagation();
        $mdOpenMenu($event);
    }

    /**
     * Display modal dialog for new mirror creation
     */
    public openNewMirrorDialog(event) {
        this.$mdDialog
            .show({
                template: `<mirror-form></mirror-form>`,
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
            })
            .then(() => this.load());
    }

    /**
     * Generates the Lock-Mirror Dialog and returns it
     */
    public getLockMirrorDialog = function(ev, name) {
        return this.$mdDialog
            .confirm()
            .targetEvent(ev)
            .clickOutsideToClose(true)
            .title('Are you sure?')
            .textContent(`Do you want to lock ${name}? You can not revert it.`)
            .ariaLabel('Mirror lock Confirmation')
            .ok('Lock!')
            .cancel('You scared me');
    };

    /**
     * Locks the given mirror version
     */
    public async lockMirror(versionId) {
        try {
            const result = await this.ProjectVersionService.lock(versionId);
            this.load();

            toastr.success(result);
        } catch (err) {
            toastr.error(err.data);
        }
    }

    /**
     * Opens a confirmation to lock the mirror.
     */
    public async showLockMirrorConfirmation(ev: Event, versionId: number, name: string) {
        const confirm = this.getLockMirrorDialog(ev, name);
        await this.$mdDialog.show(confirm);
        this.lockMirror(versionId);
    }

    /**
     * Remove a mirror from aptly server and database
     * This will unpublish the mirror's snapshot, remove the snapshot
     * and drop the mirror
     */
    public async deleteMirror(ev, id, name) {
        const confirm = this.$mdDialog.confirm()
            .title('Remove mirror: ' + name)
            .textContent('Do you really want to remove this mirror?')
            .ariaLabel('remove mirror')
            .targetEvent(ev)
            .ok('Ok')
            .cancel('Cancel');

        try {
            await this.$mdDialog.show(confirm);
            await this.MirrorService.delete(id);
            this.$state.reload(this.$state.current.name);
        } catch (err) {
            toastr.error(err.data);
        }
        this.load();
    }

    /**
     * Updates a mirror by sending a PUT-request to the
     * backend
     */
    public async updateMirror(mirror) {
        try {
            const response = await this.MirrorService.update(mirror.id);
            this.load();
            toastr.success(response.data);
        } catch (err) {
            toastr.error(err.data);
        }
    }

    /**
     * Updates the URL, depending on the bound filters
     */
    public updateURL() {
        let statename = '.filter';

        if (this.$state.current.name.indexOf('.filter') !== -1) {
            statename = '^' + statename;
        }
        this.$state.transitionTo(statename, {
            page: this.query.page,
            pageSize: this.query.pageSize,
            filter_name: this.query.filter_name,
        }, {
            inherit: true,
            relative: this.$state.$current,
            notify: false,
            reload: false,
            location: 'replace',
        });
    }
}

/**
 * This component displays an overview of mirrors.
 */
export const MirrorOverviewComponent = {
    templateUrl: template,
    controller: MirrorOverviewController,
    bindings: {
        mirrors: '<',
        user: '<',
        query: '<',
    },
};
