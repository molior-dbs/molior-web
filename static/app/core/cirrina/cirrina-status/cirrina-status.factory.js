import { findKey } from 'lodash';

/**
 * @ngdoc service
 * @name moliorApp.core.cirrina.status.service:CirrinaStatus 
 * @description
 * Handles websocket status updates
 * 
 * @requires rx
 * @requires moliorApp.log.service:Log
 *
 * @class CirrinaStatus
 */
export class CirrinaStatus {
    constructor(rx, Log, WEBSOCKET_STATUS) {
        this.rx = rx;
        this.logger = Log.init('CirrinaStatusService');
        this.currentStatus = false;
        this.statusSubject = new rx.Subject();
        this.WEBSOCKET_STATUS = WEBSOCKET_STATUS;
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.status.service:CirrinaStatus
     * @name moliorApp.core.cirrina.status.service:CirrinaStatus#subscribe
     * @description
     * Subscribe to status events
     * 
     * @param {Function} func The callback
     *
     * @example
     <pre>
     class Controller {
         constructor(CirrinaStatus, WEBSOCKET_STATUS) {
            CirrinaStatus.status = WEBSOCKET_STATUS.CONNECTED;
            CirrinaStatus
                .subscribe(console.log);
         }
     }
     </pre>
     */
    subscribe(func) {
        return this.rx.Observable.create(observer => {
            this.statusSubject.subscribe(observer);
        })
            .subscribe(func);
    }

    /**
     * Set the status and update subscribers
     * @param {WEBSOCKET_STATUS} value Websocket status  
     * 
     * @memberof CirrinaStatus
     */
    set status(value) {
        let websocketStatusName = findKey(this.WEBSOCKET_STATUS, s => s === value);
        this.logger.info(`Connection set to ${websocketStatusName}`);
        this.currentStatus = value;
        this.statusSubject.onNext(value);
    }

    /**
     * @returns {WEBSOCKET_STATUS} The current status
     */
    get status() {
        return this.currentStatus;
    }
}
