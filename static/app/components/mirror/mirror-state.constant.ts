/**
 * An object which provides all mirror states
 *
 * MirrorStates:
 * UNDEFINED: 'undefined'
 * CREATED: 'created'
 * UPDATE: 'updating'
 * READY: 'ready'
 * ERROR: 'error'
 *
 * @example
 * <pre>
 * function MyController(MirrorState) {
 *  console.log(MirrorState.UNDEFINED); // "undefined"
 *  console.log(MirrorState.UPDATING); // "updating"
 * }
 * </pre>
 */
export const MirrorState = {
    UNDEFINED: 'undefined',
    CREATED: 'created',
    UPDATING: 'updating',
    READY: 'ready',
    ERROR: 'error',
};
