/**
 * This component displays the release notes.
 *
 */
export const ReleaseNotesComponent = {
    template: `
<main class="markdown-container" flex-gt-xs="100" flex-offset-gt-xs="0" flex-gt-md="80" flex-offset-gt-md="10">
    <md-card>
        <md-card-content class="markdown-container-content" markdown-to-html="$ctrl.currentReleaseNotes"></md-card-content>
    </md-card>
    <md-card>
        <md-card-content class="markdown-container-content" markdown-to-html="$ctrl.releaseNotes"></md-card-content>
    </md-card>
</main>
    `,
    bindings: {
        currentReleaseNotes: '<',
        releaseNotes: '<',
    },
};
