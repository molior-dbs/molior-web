import moment from 'moment/src/moment';
/**
 * @ngdoc service
 * @name moliorApp.common.log.service:Log
 * @description
 * A service which provides easier logging 
 *
 * @requires moliorApp.common.log.constant:LogType
 */
export class Logger {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }

    /**
     * @ngdoc
     * @name moliorApp.common.log.service:Log#info
     * @methodOf moliorApp.common.log.service:Log
     * @description
     * Logs a message with a prefix
     *
     * @param {String} message The content of the message
     * 
     * @example
     * <pre>
     * logger.info('Received Builds!');
     * </pre>
     */
    info() {
        for (var i = 0; i < arguments.length; i++) {
            var argument = arguments[i];
            if (argument !== null && typeof argument === 'object') {
                console.log(argument); // eslint-disable-line no-console
            } else {
                console.log('%c[' + moment().format('HH:mm:ss.SS') + '] %c' + this.name + ': %c' + argument, 'color:#424242', 'color:' + this.color + ';', 'color:#424242'); // eslint-disable-line no-console
            }
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.common.log.service:Log#error
     * @methodOf moliorApp.common.log.service:Log
     * @description
     * Logs a message with an error prefix
     *
     * @param {String} message The content of the message
     * 
     * @example
     * <pre>
     * logger.error('Received Builds!');
     * </pre>
     */
    error() {
        for (var i = 0; i < arguments.length; i++) {
            var argument = arguments[i];
            if (argument !== null && typeof argument === 'object') {
                console.log(argument); // eslint-disable-line no-console
            } else {
                console.log('%c[' + moment().format('HH:mm:ss.SS') + '] %c' + this.name + ': %c' + argument, 'color:red', 'color:' + this.color + ';', 'color:red'); // eslint-disable-line no-console
            }
        }
    }
}

export class LogFactory {
    constructor(LogType) {
        this.logType = LogType;
    }

    getColorByName(name) {
        let newColor;
        let color = '#424242';
        Object
            .keys(this.logType)
            .forEach(key => {
                if (name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                    newColor = this.logType[key];
                }
            });
        if (newColor) {
            color = newColor;
        }
        return color;
    }
    /**
     * @ngdoc
     * @name moliorApp.common.log.service:Log#init
     * @methodOf moliorApp.common.log.service:Log
     * @description
     * Initializes the logger
     *
     * @param {String} name The name of the logger, which gets displayed
     * @param {String} color The hex color of the logger (optional)
     */
    init(name, color) {
        if (color === undefined) {
            color = this.getColorByName(name);
        }
        return new Logger(name, color);
    }
}
