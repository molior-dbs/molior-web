import './molior-status.style.scss';

import { chain, assignIn, valuesIn } from 'lodash';

import { MoliorStatusService } from './molior-status.service';
import { MoliorStatusResponse } from './interfaces';

const CHECK_INTERVAL = 3000 * 10;

interface PackageStatus {
    name: string;
    version: string;
    running: boolean;
}

/**
 * Represents the status of the molior packages and their version
 */
export class MoliorStatusController { }

/**
 * @ngdoc directive
 * @name moliorApp.components.moliorStatus.directive:moliorStatus
 * @description
 * Represents the status of the molior packages and their version
 * @restrict 'E'
 *
 * @param {Object} status List of molior status
 */
export const MoliorStatusComponent = {
    template: `
<section class="molior-status" layout="column" flex>
    <header layout="column" flex layout-align="center center">
        <figure layout-align="center center" layout="column" flex class="overall-status overall-status-running">
            <ng-md-icon icon="check" size="65"></ng-md-icon>
        </figure>
        <h1>
            <span>Everything's fine!</span>
        </h1>
        <h2>
            <span>molior is up and running normally</span>
        </h2>
    </header>
</section>
    `,
    controller: MoliorStatusController,
    bindings: {
        status: '<',
    },
};
