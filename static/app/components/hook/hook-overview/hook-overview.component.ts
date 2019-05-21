
/**
 * Represents an overview of the given hooks
 */
export class HookOverviewController { }

/**
 * Represents an overview of the given hooks
 */
export const HookOverviewComponent = {
    template: `
<md-card flex class="animate-in">
    <md-table-container>
        <table md-table>
            <thead md-head>
                <tr md-row>
                    <th md-column>Enabled</th>
                    <th md-column>Url</th>
                    <th md-column>Method</th>
                    <th md-column></th>
                </tr>
            </thead>
            <tbody md-body>
                <tr hook-item hook="hook" ng-repeat="hook in $ctrl.hooks" md-row>
                </tr>
                <tr ng-if="$ctrl.hooks === undefined || $ctrl.hooks.length === 0">
                    <td colspan="4">
                        <div layout="row" layout-align="center center">
                            <span>No Hooks found.</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </md-table-container>
</md-card>
    `,
    controller: HookOverviewController,
    bindings: {
        hooks: '<',
    },
};
