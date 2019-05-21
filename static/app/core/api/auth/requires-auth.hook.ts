import { HookMatchCriteria, StateService, Transition, TransitionService } from '@uirouter/angularjs';

/**
 * @name RequiresAuthHook
 * @description
 * Checks when a state change occurs, if the user
 * has the needed credentials to visit the site.
 * Otherwise you'll redirect to the login state
 */
export function RequiresAuthHook($transitions: TransitionService, Auth) {
    const changeState = ($state: StateService) => !Auth.isUserAuthorized() ? $state.target('login') : null;

    const hookCriteria: HookMatchCriteria = {
        to: (state) => state.data && state.data.requiresAuth,
    };

    const onBefore = (transition: Transition) => {
        return new Promise((resolve, reject) => {
            const $state = transition.router.stateService;
            if (Auth.isUserAuthorized() === undefined) {
                // wait until state is decided
                Auth.onUserStateChange().then(null, null, () =>  resolve(changeState($state)));
            } else {
                // Already decided..
                resolve(changeState($state));
            }
        });
    };

    // @ts-ignore
    $transitions.onBefore(hookCriteria, onBefore, { priority: 10 });
}
