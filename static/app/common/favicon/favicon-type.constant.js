/**
 * @ngdoc object
 * @name moliorApp.common.favicon.constant:FaviconType
 * @description
 * An object which provides all favucib types. The value of the FaviconTypes
 * is the path to the icon file relative to the index.html
 *
 * FaviconTypes:
 * - PROJECT 
 * - USER 
 * - BUILD
 * @example
 * <pre>
 * function MyController(FaviconType) {
 *  console.log(FaviconType.DEFAULT); // 'favicon.ico'
 *  console.log(FaviconType.BUILD_FAILED); // 'assets/img/moliorbuild_fail.ico'
 *  console.log(FaviconType.BUILD_PASS); // 'assets/img/moliorbuild_pass.ico'
 * }
 * </pre>
 */
export const FaviconType = {
    'DEFAULT': 'favicon.ico',
    'BUILD_FAILED': 'assets/img/moliorbuild_fail.ico',
    'BUILD_PASS': 'assets/img/moliorbuild_pass.ico'
};
