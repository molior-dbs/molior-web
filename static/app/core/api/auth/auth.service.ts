/**
 * @ngdoc service
 * @name moliorApp.core.auth.service:Auth
 * @description
 *  Handles all Authentication Methods
 *
 * @requires $http
 * @requires $q
 * @requires moliorApp.core.cirrina.service:Cirrina
 * @requires moliorApp.log.service:Log
 */
export function Auth($http, $q, Cirrina, Log, Util) {

    const auth = this;
    const onUserStateChangePromise = $q.defer();
    const onSessionChangePromise = $q.defer();

    auth.authorized = undefined;

    const logger = Log.init('AuthService');

    auth.session = {
        onChange() {
            return onSessionChangePromise.promise;
        },
    };

    Cirrina.websocket.onMessage().subscribe((data) => {
        if (data.status === 401) {
            setAuthorized(false);
        } else {
            if (data.subject === Cirrina.subject.WEBSOCKET &&
                data.event === Cirrina.event.CONNECTED) {
                setAuthorized(true);
                $http.get('/api/userinfo')
                    .then((response) => {
                        auth.session.username = response.data.username;
                        auth.session.userId = response.data.user_id;
                        auth.session.isAdmin = response.data.is_admin;
                        onSessionChangePromise.resolve(auth.session);
                    }, (err) => {
                        onSessionChangePromise.reject(err);
                    });
            }
        }
    });

    /**
     * @name setAuthorized
     * @description
     * Sets the authorization value
     * and updates the subscribers from
     * onUserStateChange
     *
     * @param {Boolean} value The state of the authorization
     * (true = authorized)
     * (false = unauthorized)
     * (undefined = unknown)
     */
    function setAuthorized(value) {
        if (value) {
            logger.info('User authorized');
        } else {
            Cirrina.stopReconnectLoop();
            logger.info('User not authorized');
        }

        if (auth.authorized !== value) {
            auth.authorized = value;
            onUserStateChangePromise.notify(value);
        }
    }

    /**
     * @ngdoc
     * @name moliorApp.core.auth.service:Auth#login
     * @methodOf moliorApp.core.auth.service:Auth
     *
     * @description
     * Logs the user in using the password & username
     *
     * @param {String} username The username
     * @param {String} password The  password
     *
     * @example
     * <pre>
     *  Auth.login('myUsername', 'myPassword');
     * </pre>
     *
     * @returns {Promise} A $http promise
     */
    auth.login = async function(username, password) {
        logger.info('Authorizing User "' + username + '"');
        const response = await $http({
            method: 'POST',
            url: '/plogin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: Util.toURIParam({ username, password }),
        });

        setAuthorized(true);
        Cirrina.reconnect();
        return response;
    };

    /**
     * @ngdog
     * @name moliorApp.core.auth.service:Auth#logout
     * @methodOf moliorApp.core.auth.service:Auth
     *
     * @description
     * Logout the user
     *
     */
    auth.logout = function() {
        const deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/logout',
        }).then(function(response) {
            deferred.resolve(response);
            window.location.reload();
        });
    };

    /**
     * @ngdoc
     * @name moliorApp.core.auth.service:Auth#isUserAuthorized
     * @methodOf moliorApp.core.auth.service:Auth
     *
     * @description
     * Gives back if the user is authorized or not.
     * Returns undefined, when the status is not checked yet.
     *          *
     * @example
     * <pre>
     *  if(Auth.isUserAuthorized()){
     *        $ctrl.authorized = true;
     *  }
     * </pre>
     *
     * @returns {Boolean} If the user is authorized or not
     */
    auth.isUserAuthorized = function() {
        return auth.authorized;
    };

    /**
     * @ngdoc
     * @name moliorApp.core.auth.service:Auth#onUserStateChange
     * @methodOf moliorApp.core.auth.service:Auth
     * @description
     * Notifies its subscribers when the user state changes
     *
     * @example
     * <pre>
     *    Auth.onUserStateChange().then(null, null, function(state){
     *        if(state){
     *            console.log('he\'s authorized');
     *         }
     * });
     * </pre>
     * @returns {Promise} A promise, which gets notified, when
     * the user state changes
     */
    auth.onUserStateChange = function() {
        return onUserStateChangePromise.promise;
    };
}
