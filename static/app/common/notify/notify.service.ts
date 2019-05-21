import * as angular from 'angular';

export class Notify {
    constructor(private $mdToast: any) {}

    /**
     * Generates a default molior style toast
     *
     * @param {String} message The content of the message
     */
    public notify(message: string) {
        return this.$mdToast.simple()
            .textContent(message)
            .action('×')
            .highlightAction(true)
            .position('top right')
            .hideDelay(6000);
    }
}
