
/**
 * Hides $mdDialog on state changes
 */
export function MdDialogCloseHook($transitions, $mdDialog) {
    $transitions.onBefore({}, () => $mdDialog.hide());
}
