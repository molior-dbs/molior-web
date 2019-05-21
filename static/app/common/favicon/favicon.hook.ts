/**
 * Resets the favicon to default when state changes
 */
export function FaviconHook($transitions, Favicon, FaviconType) {
    $transitions.onBefore({
        to() {
            Favicon.setFavicon(FaviconType.DEFAULT);
        },
    });
}
