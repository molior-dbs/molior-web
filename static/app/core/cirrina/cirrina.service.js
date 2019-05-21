import { findKey } from 'lodash';

/**
 * @ngdoc service
 * @name moliorApp.core.cirrina.service:Cirrina
 * @description
 * A service which connects the cirrina backend
 * with the frontend
 *
 * @requires rx
 * @requires moliorApp.core.cirrina.constant:CirrinaSubject
 * @requires moliorApp.core.cirrina.constant:CirrinaAction
 * @requires moliorApp.core.cirrina.constant:CirrinaEvent
 * @requires moliorApp.core.cirrina.status.service:CirrinaStatus
 * @requires moliorApp.core.cirrina.status.constant:WEBSOCKET_STATUS
 * @requires moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
 * @requires moliorApp.core.cirrina.observer.factory:Observer
 * 
 * 
 <pre>
 class Controller {
     constructor (Cirrina) {
        Cirrina
            .when(Cirrina.subject.BUILD, Cirrina.event.ADDED)
            .then()
            .subscribe(console.log);

        Cirrina
            .emit(Cirrina.subject.LIVELOG, Cirrina.action.START, {
                'build_id': this.build.id
            });
     }
 }
 </pre>
 */
export class Cirrina {
    constructor(rx, Log, CirrinaSubject, CirrinaAction, CirrinaEvent, CirrinaStatus, WEBSOCKET_STATUS, CirrinaWebsocket, Observer) {
        this.rx = rx;
        this.subject = CirrinaSubject;
        this.action = CirrinaAction;
        this.event = CirrinaEvent;
        this.observer = Observer;
        this.logger = Log.init('CirrinaService');
        this.observers = [];
        this.createObserversArray();
        this.status = CirrinaStatus;
        this.websocket = CirrinaWebsocket;
        this.WEBSOCKET_STATUS = WEBSOCKET_STATUS;
        this.websocket.onMessage().subscribe(message => this.notifyObservers(message));
        this.websocket.onClose().subscribe(() => this.startReconnectLoop());
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#createObserversArray
     * @description
     * Fills up the `this.observers` Array with
     * empty arrays for each subject and event
     * 
     * @memberof Cirrina
     */
    createObserversArray() {
        Object.keys(this.subject).forEach(subject => {
            this.observers[this.subject[subject]] = [];
            Object.keys(this.event).forEach(event => {
                this.observers[this.subject[subject]][this.event[event]] = [];
            });
        });
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#when
     * @description
     * When the given event happens on the given subject
     * 
     * @param {CirrinaSubject} subject The subject which can be sent by websockets
     * @param {CirrinaEvent} event The event which you want to subscribe to
     * 
     * @returns {Observer} Returns the observer which handles the subscription or unsubscription
     * @memberof Cirrina
     * 
     * @example
     <pre>
     Cirrina
        .when(Cirrina.subject.BUILD, Cirrina.event.ADDED)
        .then()
        .subscribe(console.log);
    </pre>

     */
    when(subject, event) {
        return new this.observer(this, subject, event);
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#emit
     * @description
     * Emits a message to the websocket connection
     * 
     * @param {CirrinaSubject} subject The subject the message relates to
     * @param {CirrinaAction} action The action it should run
     * @param {any} message The message to send
     * 
     * @memberof Cirrina
     * 
     * @example
     <pre>
     Cirrina
        .emit(Cirrina.subject.LIVELOG, Cirrina.action.START, {
            'build_id': this.build.id
        });
    </pre>
     */
    emit(subject, action, message) {
        this.websocket.send({
            subject: subject,
            action: action,
            data: message
        });
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#notifyObservers
     * @description
     * Send a message to the corresponding subscribers
     * 
     * @param {Object} message The message to send to the subscribers
     * 
     * @memberof Cirrina
     */
    notifyObservers(message) {
        if (message.message) {
            message = message.message;
        }
        if (!message.subject || !message.event) {
            return;
        }
        this.logger.info(`Received message ${message.subject}:${findKey(this.subject, s => s === message.subject)} ${message.event}:${findKey(this.event, s => s === message.event)}`, message);

        this.observers[message.subject][message.event]
            .forEach(observer => observer.next(message.data));
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#stopReconnectLoop
     * @description
     * Stop the reconnect loop of `Cirrina.startReconnectLoop();`
     */

    stopReconnectLoop() {
        this.logger.info('Stopping reconnecting loop');
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.reconnectLoopStopped = true;
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#startReconnectLoop
     * @description
     * Start a Loop of 1 sec trying to reconnect.
     */
    startReconnectLoop() {
        this.logger.info(`Trying to reconnect to ${this.websocket.url}`);
        if (!this.reconnectLoopStopped) {
            this.reconnectTimeout = setTimeout(this.reconnect.bind(this), 1000);
        }
        this.logger.info('Websocket is disconnected');
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.service:Cirrina
     * @name moliorApp.core.cirrina.service:Cirrina#reconnect
     * @description
     * Reset the websocket instance
     */
    reconnect() {
        this.websocket.connect();
    }
}
