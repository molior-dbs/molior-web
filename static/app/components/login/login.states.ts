import { Ng1StateDeclaration, Transition } from '@uirouter/angularjs';
import { appState } from '@molior/app.states';

export const loginState: Ng1StateDeclaration = {
    name: 'login',
    url: '/login',
    component: 'login',
    parent: appState.name,
    data: {
        moliorHeader: false,
    },
    resolve: { returnTo },
};

/**
 * A resolve function for 'login' state which figures out what state to return to, after a successful login.
 *
 * If the user was initially redirected to login state (due to the requiresAuth redirect), then return the toState/params
 * they were redirected from.  Otherwise, if they transitioned directly, return the fromState/params.  Otherwise
 * return the main "home" state.
 */
function returnTo() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnTo') || '/project';
}
