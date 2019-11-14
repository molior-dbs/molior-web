import * as angular from 'angular';
import * as toastr from 'toastr';
import { StateService, StateParams } from '@uirouter/core';
import { NodeService } from './node.service';

/**
 * Controller for a node overview. Used in
 */
class NodeOverviewController {
    public query: any;
    public nodes: any;

    constructor(
        private NodeService: NodeService,
        private $mdDialog: any,
        private $scope: angular.IRootScopeService,
        private $state: StateService,
        private $stateParams: StateParams,
    ) {
        this.NodeService = NodeService;
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.$scope = $scope;
    }

    /**
     * Initializes the component
     */
    public $onInit() {
        this.$scope.$watchCollection('$ctrl.query', () => this.updateURL());
        this.load();
    }

    private async load() {
        this.nodes = await this.NodeService
            .all({
                page: this.query.page,
                page_size: this.query.page_size,
                q: this.query.q,
            });
        this.$scope.$apply();
    }

    /**
     * Updates the URL, depending on the bound filters
     */
    private updateURL() {
        this.$state.transitionTo('nodes.list', this.query, {
            inherit: true,
            relative: this.$state.$current,
            notify: false,
            reload: false,
            location: 'replace',
        });
    }
}

/**
 * This component displays an overview of nodes.
 *
 *       <div layout="row" class="overview-header" layout-align="space-between center">
 *           <div flex="60">
 *               <md-autocomplete md-search-text-change="$ctrl.load()" md-search-text="$ctrl.query.q" md-items="item in []" placeholder="Name"></md-autocomplete>
 *           </div>
 *           <div flex="60"><span>Architecture</span></div>
 *           <div flex="60"><span>State</span></div>
 *           <div flex="60"><span>Load</span></div>
 *           <div flex="60"><span>Uptime</span></div>
 *       </div>
 * @restrict 'E'
 * @example
 * <pre>
 *    <node-overview></node-overview>
 * </pre>
 */
export const NodeOverviewComponent = {
    template: `
<div class="node-overview">
    <div flex-gt-xs="100" flex-offset-gt-xs="0" class="node-subnav">
        <div flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10" layout="row" layout-align="space-between end">
           <h2 layout-margin class="title-spaceing"><strong>Nodes</strong></h2>
        </div>
    </div>
    <md-card flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10">
        <md-table-container>
            <table md-table>
                <thead md-head>
                    <tr md-row>
                        <th md-column>
                            <div flex>
                                <md-autocomplete md-search-text-change="$ctrl.load()" md-search-text="$ctrl.query.q" md-items="item in []" placeholder="Name"></md-autocomplete>
                            </div>
                        </th>
                        <th md-column>Architecture</th>
                        <th md-column>State</th>
                        <th md-column>Load</th>
                        <th md-column>Uptime</th>
                    </tr>
                </thead>
                <tbody md-body>
                    <tr ng-repeat="node in $ctrl.nodes.results" md-row>
                        <td md-cell><strong>{{node.name}}</strong></td>
                        <td md-cell>{{node.arch}}</td>
                        <td md-cell>{{node.state}}</td>
                        <td md-cell>{{node.load}}</td>
                        <td md-cell>{{node.uptime_seconds}}s</td>
                    </tr>
                    <tr ng-if="$ctrl.nodes === undefined || $ctrl.nodes.length === 0">
                        <td colspan="5">
                            <div layout="row" layout-align="center center">
                                <span>No build nodes registered.</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </md-table-container>
        <md-table-pagination md-on-paginate="load" md-limit="$ctrl.query.page_size" md-limit-options="[10, 20, 50]" md-page="$ctrl.query.page" md-total="{{ $ctrl.nodes.total_result_count }}" md-page-select="true" md-boundary-links="true">
    </md-card>
</div>
    `,
    controller: NodeOverviewController,
    bindings: {
        query: '<',
        nodes: '<',
    },
};
