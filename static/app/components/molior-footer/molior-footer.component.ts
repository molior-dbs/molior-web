import './molior-footer.style.scss';
import { MoliorStatusService } from '../molior-status/molior-status.service';

class MoliorFooterController {
    public status: any;
    public showImages: boolean;

    constructor(
        private MoliorStatus: MoliorStatusService,
    ) {
        this.showImages = this.isAprilFoolsDay();
    }

    public $onInit() {
        this.updateMoliorStatus();
    }

    public isAprilFoolsDay(): boolean {
        const dt = new Date();
        const month = dt.getMonth() + 1;
        const day = dt.getDate();
        return month === 4 && day === 1;
    }

    public async updateMoliorStatus() {
        this.status = await this.MoliorStatus.all();
    }
}

/**
 * @ngdoc directive
 * @name moliorApp.components.moliorFooter.directive:moliorFooter
 * @description
 * This component displays the foter.
 *
 * @restrict 'E'
 * @scope
 */
export const MoliorFooterComponent = {
    template: `
<footer flex layout="column" class="molior-footer">
    <div flex layout="row" layout-margin layout-align="center center">
        <div>
            <span>molior-server</span>
            <span ng-bind="$ctrl.status.versions['molior-server'][0]"></span></span>
            <span> | </span>
            <a ui-sref="status">Server Status</a>
            <span> | </span>
            <a href="/release-notes">Release Notes</a>
            <span> | </span>
            <a href="/getting-started">Getting Started</a>
        </div>
    </div>
    <div flex layout="row" layout-margin layout-align="center center" ng-if="$ctrl.showImages">
        <img src="/assets/img/notepad.gif" alt="Notepad" />
        <img src="/assets/img/ie_logo.gif" alt="IE" />
    </div>
</footer>
        `,
    controller: MoliorFooterController,
};
