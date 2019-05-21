import * as angular from 'angular';

import { Ng1StateDeclaration, StateProvider } from '@uirouter/angularjs';
import { values } from 'lodash';

import * as momentduration from 'moment-duration-format';
import moment from 'moment/src/moment';

momentduration(moment);

/**
 * @ngdoc service
 * @name moliorApp.util.service:Util
 * @description
 *
 *  Service which provides utility functions, which are available globally
 * in the moliorApp.
 * @requires moliorApp.favicon.service:Favicon
 * @requires moliorApp.favicon.constant:FaviconType
 * @requires moliorApp.components.buildstate.constant:Buildstate
 */
export class Util {
    constructor(
        private readonly Favicon,
        private readonly FaviconType,
        private readonly Buildstate) {
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#setFaviconbyBuildstatename
     * @methodOf moliorApp.util.service:Util
     * @description
     * Sets the favicon of molior by the given
     * buildstateName
     *
     * @example
     * <pre>
     *  Util.setFaviconbyBuildstatename('done'); // sets the favicon to FaviconType.BUILD_PASS
     * </pre>
     *
     * @param {String} buildstateName The name of the buildstate
     */
    public setFaviconbyBuildstatename(buildstateName) {
        switch (buildstateName) {
        case this.Buildstate.BUILD_FAILED:
            this.Favicon.setFavicon(this.FaviconType.BUILD_FAILED);
            break;
        case this.Buildstate.DONE:
            this.Favicon.setFavicon(this.FaviconType.BUILD_PASS);
            break;
        default:
            this.Favicon.setFavicon(this.FaviconType.DEFAULT);
            break;
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#isArray
     * @methodOf moliorApp.util.service:Util
     * @description
     * Checks if the given object is an array
     *
     * @example
     * <pre>
     *  Util.isArray([]); // True
     *  Util.isArray('not an array'); // False
     * </pre>
     *
     * @param {any} obj The object to test
     */
    public isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#pythonifyVariable
     * @methodOf moliorApp.util.service:Util
     * @description
     * Converts human readables names to
     * python variable names.
     *
     * @example
     * <pre>
     *  Util.pythonifyVariable('Test Variable'); // returns 'test_variable'
     * </pre>
     *
     * @returns {String} A string which is in the python-variable format
     */
    public pythonifyVariable(variable) {
        return variable
            .split(' ')
            .map((item) => item.toLowerCase())
            .join('_');
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service.Util#isNormalInteger
     * @methodOf moliorApp.util.service:Util
     * @description
     * Checks if the given string is a positive
     * integer
     *
     * @example
     * <pre>
     *  Util.isNormalInteger('1'); // true
     *  Util.isNormalInteger('-1'); // false
     *  Util.isNormalInteger('1.2'); // false
     *  Util.isNormalInteger('a'); // false
     * </pre>
     */
    public isNormalInteger(str: string): boolean {
        const n = Math.floor(Number(str));
        return String(n) === str && n >= 0;
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#unpythonifyVariable
     * @methodOf moliorApp.util.service:Util
     * @description
     * Converts python variable names to
     * more human readable strings.
     *
     * @example
     * <pre>
     *  Util.unpythonifyVariable('test_variable'); // returns 'Test Variable'
     *  Util.unpythonifyVariable('harry_speaks_parsel_not_python'); // returns 'Harry Speaks Parsel Not Python'
     * </pre>
     *
     * @returns {String} A string which is more human readable
     */
    public unpythonifyVariable(variable: any) {
        return variable
            .toString()
            .split('_')
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            .join(' ');
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#isStringValidDate
     * @methodOf moliorApp.util.service:Util
     *
     * @description
     * Checks if the given string is a valid date
     * (ISO 8601)
     *
     * @param {String} The date, which should get check if it is valid or not
     *
     * @example
     * <pre>
     *    Util.isStringValidDate('2016-01-01 12:00:00') // true
     *  Util.isStringValidDate(':)') // false
     * </pre>
     *
     * @returns {Boolean} Whether the string is valid or not
     */
    public isStringValidDate(date) {
        return moment(date, moment.ISO_8601, true).isValid();
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#formatDuration
     * @methodOf moliorApp.util.service:Util
     *
     * @description
     * Formats the momentjs duration to the best possible format
     *
     * @param {Object} duration The momentjs duration Object
     *
     * @returns {String} The formatted duration
     */
    public formatDuration(duration) {
        let formatTemplate = '';
        if (duration.days() > 0) {
            formatTemplate += 'd [d] ';
        }
        if (duration.hours() > 0) {
            formatTemplate += 'h [hrs] ';
        }
        if (duration.minutes() > 0) {
            formatTemplate += 'm [min] ';
        }
        if (duration.seconds() > 0 && duration.hours() === 0 && duration.days() === 0) {
            formatTemplate += 's [sec] ';
        }
        if (formatTemplate === '') {
            return '';
        }
        return duration.format(formatTemplate);
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#getFormattedDurationOfBuild
     * @methodOf moliorApp.util.service:Util
     *
     * @description
     * Returns the duration of the build as a formatted string
     *
     * @param {Object} build The build object
     *
     * @returns {String} The formatted duration
     */
    public getFormattedDurationOfBuild(build) {
        let endstamp = build.endstamp;
        if (!build.endstamp || build.endstamp === 'None') {
            endstamp = Date.now();
        }
        return this.formatDuration(moment.duration(moment(endstamp).diff(moment(build.startstamp))));
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#normalizeBuild
     * @methodOf moliorApp.util.service:Util
     *
     * @description
     * Adjusts the raw build from the backend.
     *
     * @example
     * <pre>
     * Util.normalizeBuild({
     *     startstamp: '2016-05-03 19:23:42.3241',
     *     endstamp: '2016-05-03 19:24:42.3241',
     *     status: 'up_to_date',
     * }); // { 'startstamp': '2016-05-03 19:23:42', 'endstamp': '2016-05-03 19:24:42.3241', 'duration': '2m 16s' 'status': { 'displayName': 'Done', 'name': 'done' } }
     * </pre>
     *
     * @returns {Object} The new normalized build
     */
    public normalizeBuild(build) {
        if (this.isStringValidDate(build.startstamp) && this.isStringValidDate(build.endstamp)) {
            build.duration = this.getFormattedDurationOfBuild(build);
        } else {
            build.duration = '';
        }

        if (this.isStringValidDate(build.startstamp)) {
            build.startstamp = moment(build.startstamp).format('YYYY-MM-DD HH:mm:ss');
            build.startString = moment(build.startstamp).fromNow();
        } else {
            build.startstamp = '';
            build.startString = '';
        }

        if (build.buildvariant &&
            build.buildvariant.architecture &&
            build.buildvariant.base_mirror) {
            build.buildvariant.name =
                build.buildvariant.base_mirror.name +
                ' ' +
                build.buildvariant.architecture.name;
        }

        return build;
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#getFormattedTimestamp
     * @methodOf moliorApp.util.service:Util
     *
     * @description
     * Formats using momentjs the given timestamp
     * to 'fromNow()'-Format
     *
     * @example
     * <pre>
     * Util.getFormattedTimestamp('2016-05-03 19:23:42.3241'); // an hour ago
     * </pre>
     *
     * @param {String|Object} timestamp The unformatted date
     *
     * @returns {String} The formatted date
     */
    public getFormattedTimestamp(timestamp) {
        if (timestamp === 'None' || timestamp === '' || timestamp === undefined) {
            return undefined;
        }
        return moment(timestamp).fromNow();
    }

    /**
     * @ngdoc
     * @name moliorApp.util.service:Util#getDaysInBetween
     * @methodOf moliorApp.util.service:Util
     *
     * @description
     * Calculates the days between the two given dates
     *
     * @param {Date} date1 The first date
     * @param {Date} date2 The second date
     *
     * @example
     * <pre>
     * var today = new Date();
     * var yesterday = new Date(new Date().setDate(new Date().getDate() - i));
     * Util.getDaysInBetween({
     *     today,
     *     yesterday
     * }); // 1
     * </pre>
     *
     * @returns {Number} The days between the two given dates
     */
    public getDaysInBetween(date1, date2) {
        const ONE_DAY = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        const date1Ms = date1.getTime();
        const date2Ms = date2.getTime();

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(date1Ms - date2Ms);

        // Convert back to days and return
        return Math.round(differenceMs / ONE_DAY);
    }

    /**
     * Encodes the given parameters
     * @example
     * toURIParam({a: 1, b: 2}) // 'a=1&b=2'
     * @param source The source object
     */
    public toURIParam(source: object) {
        const array = [];

        for (const key in source) {
            array.push(encodeURIComponent(key) + '=' + encodeURIComponent(source[key]));
        }

        return array.join('&');
    }
}

/**
 * @ngdoc
 * @name moliorApp.util.service:Util#registerStates
 * @methodOf moliorApp.util.service:Util
 *
 * @description
 * Returns a function which registers the given
 * states to the injected $stateProvider
 *
 * @param {object} states The imported states objects
 * @param {string?} namePrefix The prefix which gets prepended to the statename
 *
 * @returns {Function} Function which will register the given states
 * @example
 * <pre>
 * // states.ts
 * export const defaultState = { abstract: true, 'name': 'test' };
 *
 * // my-module.module.ts
 * import * as states from './states';
 * import { registerStates } from './app.util.ts';
 *
 * export const MyModule = angular
 *   .module('moliorApp.myModule', [])
 *   .config(registerStates(states))
 *
 * </pre>
 */
export function registerStates(states: {[key: string]: Ng1StateDeclaration}, namePrefix?: string) {
    // Add a 'point' to the prefix, if it is present
    namePrefix = namePrefix ? `${namePrefix}.` : '';

    return ($stateProvider: StateProvider) =>
        // Get the real state objects
        values(states)
            // Add the namePrefix to the name property
            .map((state) => ({ ...state, name: `${namePrefix}${state.name}`}))
            // Register the given states
            .forEach((state) => $stateProvider.state(state));
}

/**
 * @ngdoc overview
 * @name moliorApp.util
 * @description
 * # moliorApp.util
 *
 * Provides utility methods which are globally in the application available
 */
export const UtilModule = angular
    .module('moliorApp.util', [])
    .service('Util', Util)
    .name;
