/**
 * @ngdoc object
 * @name moliorApp.common.log.constant:LogType
 * @description
 * An object which provides all logtypes
 *
 * LogTypes:
 * DIRECTIVE: '#673ab7',
 * CONTROLLER: '#0080FF',
 * @example
 * <pre>
 * function MyController(LogType) {
 *  console.log(LogType.CONTROLLER); // "#0080FF"
 * }
 * </pre>
 */
export const LogType = {
    'DIRECTIVE': '#673ab7',
    'CONTROLLER': '#0080FF',
    'SERVICE': '#00bcd4',
    'COMPONENT': '#3f51b5'
};
