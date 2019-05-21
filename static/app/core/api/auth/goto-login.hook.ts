/**
 * Listen to User state changes.
 * If user is not Authorized and currently not on the login
 * page, he'll get redirect to the login page.
 */
export function GotoLoginOnAuthChange($state, Auth) {
    Auth.onUserStateChange().then(null, null, () => {
        if (!Auth.isUserAuthorized() && !window.location.href.includes('login')) {
            // use hard reloading and not state transition because the header
            // for some reason will still be shown
            window.location.href = `/login?returnTo=${window.location.pathname}`;
        }
    });
}
