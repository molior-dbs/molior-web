import { isObject, isArray } from 'lodash';

/**
 * @ngdoc service
 * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
 * @description
 * The service which has direct access to the
 * websocket object. When injected, it will automatically create
 * a new connection, if not created already
 *
 * @requires moliorApp.log.service:Log
 * @requires moliorApp.core.cirrina.status.service:CirrinaStatus
 * @requires moliorApp.core.cirrina.status.constant:WEBSOCKET_STATUS
 * @requires rx
 * @requires ngSocket
 * @requires $location
 *
 * @class CirrinaWebsocket
 */
class CirrinaWebsocket {
    constructor(path, Log, CirrinaStatus, WEBSOCKET_STATUS, rx, ngSocket, $location) {
        this.logger = Log.init('CirrinaWebsocketService');
        this.$location = $location;
        this.url = this.getWebsocketUrl(path);
        this.ngSocket = ngSocket;
        this.CirrinaStatus = CirrinaStatus;
        this.WEBSOCKET_STATUS = WEBSOCKET_STATUS;
        this.rx = rx;
        this.onMessageSubject = new rx.Subject();
        this.onCloseSubject = new rx.Subject();
        this.onOpenSubject = new rx.Subject();
        this.connect();
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#getWebsocketUrl
     * @description
     * Returns the full websocket url depending on https or http.
     *
     * @param {string} path  The websocket path like wss://localhost${path}
     *
     * @example
     <pre>
     CirrinaWebsocket.getWebsocketUrl('/ws'); // "wss://localhost/ws"
     </pre>
     */
    getWebsocketUrl(path) {
        let protocol, port;
        // use wss when https
        if (this.$location.protocol() === 'https') {
            protocol = 'wss://';
        } else {
            protocol = 'ws://';
        }

        if (this.$location.port() === '' || this.$location.port() === 80) {
            port = '';
        } else {
            port = ':' + this.$location.port();
        }

        return `${protocol}${this.$location.host()}${port}${path}`;
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#connect
     * @description
     * Creates a websocket connection and subscribes to events.
     */
    connect() {
        this.logger.info(`Connecting to ${this.url}`);
        this.reconnectTimeOutStopped = false;
        this.websocket = this.ngSocket(this.url);
        this.websocket.onOpen(data => this.onOpenHandler(data));
        this.websocket.onMessage(message => this.onMessageHandler(message));
        this.websocket.socket.onclose = data => this.onCloseHandler(data);
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#onOpenHandler
     * @description
     * Directly handles onOpen-websocket-event. Notifies subscribers
     *
     * @param {any} data Data from websocket onOpen-event
     */
    onOpenHandler(data) {
        this.CirrinaStatus.status = this.WEBSOCKET_STATUS.CONNECTED;
        this.onOpenSubject.onNext(data);
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#onMessageHandler
     * @description
     * Directly handles onMessage-websocket-event. Notifies subscribers
     *
     * @param {any} data Data from websocket onMessage-event
     */
    onMessageHandler(message) {
        let data = {};
        if (!message) {
            return;
        }
        try {
            data = JSON.parse(message.data);
        } catch (e) {
            this.logger.info('Websocket non json message', message, e);
        }
        this.onMessageSubject.onNext(data);
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#onCloseHandler
     * @description
     * Directly handles onClose-websocket-event. Notifies subscribers
     *
     * @param {any} data Data from websocket onClose-event
     */
    onCloseHandler(data) {
        this.CirrinaStatus.status = this.WEBSOCKET_STATUS.DISCONNECTED;
        this.onCloseSubject.onNext(data);
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#onOpen
     * @description
     * Subscribe to onOpen websocket event
     *
     * @example
     <pre>
     CirrinaWebsocket
        .onOpen()
        .subscribe(console.log)
     </pre>
     */
    onOpen() {
        return this.rx.Observable.create(observable => {
            this.onOpenSubject.subscribe(observable);
        });
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#onMessage
     * @description
     * Subscribe to onMessage websocket event
     *
     * @example
     <pre>
     CirrinaWebsocket
        .onMessage()
        .subscribe(console.log)
     </pre>
     */
    onMessage() {
        return this.rx.Observable.create(observable => {
            this.onMessageSubject.subscribe(observable);
        });
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#onClose
     * @description
     * Subscribe to onClose websocket event
     *
     * @example
     <pre>
     CirrinaWebsocket
        .onClose()
        .subscribe(console.log)
     </pre>
     */
    onClose() {
        return this.rx.Observable.create(observable => {
            this.onCloseSubject.subscribe(observable);
        });
    }

    /**
     * @ngdoc
     * @methodOf moliorApp.core.cirrina.websocket.service:CirrinaWebsocket
     * @name moliorApp.core.cirrina.websocket.service:CirrinaWebsocket#send
     * @description
     * Sends a message to the Websocket connection
     *
     * @param {any} message The message to be sent to the backend.
     *
     * @memberof CirrinaWebsocket
     */
    send(message) {
        if (isObject(message) || isArray(message)) {
            message = JSON.stringify(message);
        }
        this.websocket.socket.send(message);
        this.logger.info('Sending websocket message:', message);
    }
}

export class CirrinaWebsocketFactory {
    /**
     * Creates a new instance (= connection), if not already existing
     *
     */
    $get(MOLIOR_CONFIG, Log, CirrinaStatus, WEBSOCKET_STATUS, rx, ngSocket, $location) {
        if (!this.websocket) {
            this.websocket = new CirrinaWebsocket(MOLIOR_CONFIG.WEBSOCKET_URL, Log, CirrinaStatus, WEBSOCKET_STATUS, rx, ngSocket, $location);
        }
        return this.websocket;
    }
}
