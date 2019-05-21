import './hook-form.style.scss';
import { WebhookService } from '../webhook.service';

/**
 * @ngdoc controller
 * @name moliorApp.components.hook.controller:HookFormController
 * @description
 * A form to add hooks
 *
 */
export class HookFormController {
    private methods: string[] = ['POST', 'GET'];
    private hookTriggers: string[] = ['deb', 'src', 'overall'];
    private hook: {
        method: string;
        triggers: string[];
        body: string;
    };
    private editorOptions: {
        mode: string;
        value: any;
        viewportMargin: number;
    };
    private guide: string;

    constructor(
        private $mdDialog: any,
        private WebhookService: WebhookService,
    ) { }

    public $onInit() {
        if (this.hook === undefined) {
            this.hook = {
                method: this.methods[0],
                triggers: [this.hookTriggers[0]],
                body: '',
            };
        } else {
            this.hook.method = this.hook.method.toUpperCase();
        }

        this.editorOptions = {
            mode: 'json',
            value: this.hook.body,
            viewportMargin: Infinity,
        };
        this.loadWebhooksGuide();
    }

    private loadWebhooksGuide() {
        return this.WebhookService.guide().then((guide) => this.guide = guide);
    }

    private cancel() {
        this.$mdDialog.cancel();
    }
}

/**
 * A form to add hooks
 */
export const HookFormComponent = {
    template: `
<section class="hook-form">
    <md-toolbar>
        <div class="md-toolbar-tools">
            <h2>Add Webhook</h2>
            <span flex></span>
            <md-button aria-label="Close Webhookform" class="md-icon-button" ng-click="$ctrl.cancel()">
                <ng-md-icon icon="close" style="fill:rgba(255,255,255,0.87);" />
            </md-button>
        </div>
    </md-toolbar>
    <md-tabs md-dynamic-height>
        <md-tab label="Form">
            <form layout-margin layout="column">
                <section layout="row" flex>
                    <md-input-container>
                        <label>Method</label>
                        <md-select required ng-model="$ctrl.hook.method">
                            <md-option ng-repeat="method in $ctrl.methods" ng-value="method">
                            {{method}}
                            </md-option>
                        </md-select>
                    </md-input-container>

                    <md-input-container flex>
                        <label>Url</label>
                        <input placeholder="" required type="url" ng-model="$ctrl.hook.url">
                    </md-input-container>
                </section>
                <md-input-container>
                    <label>Webhooks for</label>
                    <md-select ng-model="$ctrl.hook.triggers" multiple>
                        <md-optgroup label="Hooks">
                            <md-option ng-value="hook" ng-repeat="hook in $ctrl.hookTriggers">{{hook}}</md-option>
                        </md-optgroup>
                    </md-select>
                </md-input-container>
                <md-input-container layout="row" class="skip-ssl">
                    <md-checkbox aria-label="skip ssl verification" ng-model="$ctrl.hook.skip_ssl"></md-checkbox>
                    Skip SSL verification
                </md-input-container>
                <md-input-container class="md-block hook-body">
                    <label>Body</label>
                    <textarea placeholder="" ui-codemirror ng-model="$ctrl.hook.body" ui-codemirror-opts="$ctrl.editorOptions"></textarea>
                </md-input-container>
                <section layout="row" layout-align="end end">
                    <md-button ng-click="$ctrl.cancel()">
                    Cancel
                    </md-button>
                    <md-button class="md-primary md-raised" ng-click="$ctrl.onUpdate({value: $ctrl.hook})">
                    Save
                    </md-button>
                </section>
            </form>
        </md-tab>
        <md-tab label="Guide">
            <div markdown-to-html="$ctrl.guide" layout-margin></div>
        </md-tab>
    </md-tabs>
</section>
    `,
    controller: HookFormController,
    bindings: {
        onUpdate: '&',
        hook: '<',
    },
};
