/**
 * @ngdoc object
 * @name moliorApp.components.buildstate.constant:Buildstate
 * @description
 * An object which provides all buildstates
 *
 * Buildstates:
 * DONE: 'done',
 * NEEDS_BUILD: 'needs_build',
 * SCHEDULED: 'scheduled',
 * BUILDING: 'building',
 * BUILD_FAILED: 'build_failed',
 * NEEDS_PUBLISH: 'needs_publish',
 * PUBLISHING: 'publishing',
 * PUBLISH_FAILED: 'publish_failed'
 * @example
 * <pre>
 * function MyController(Buildstate) {
 *  console.log(Buildstate.up_to_date); // "up_to_date"
 *  console.log(Buildstate.needs_build); // "needs_build"
 * }
 * </pre>
 */

export const BUILDSTATE = {
    NEW: 'new',
    SUCCESSFUL: 'successful',
    NEEDS_BUILD: 'needs_build',
    SCHEDULED: 'scheduled',
    BUILDING: 'building',
    BUILD_FAILED: 'build_failed',
    NEEDS_PUBLISH: 'needs_publish',
    PUBLISHING: 'publishing',
    PUBLISH_FAILED: 'publish_failed',
};
