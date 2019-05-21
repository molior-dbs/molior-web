/**
 * @ngdoc service
 * @name moliorApp.common.favicon.service:Favicon
 * @description
 * Controlls the favicon of molior.
 * 
 * @requires $q
 */
export function Favicon($q) {
    var faviconSubscripionPromise = $q.defer();

    /**
     * @ngdoc
     * @name moliorApp.common.favicon.service:Favicon#setFavicon
     * @methodOf moliorApp.common.favicon.service:Favicon
     *
     * @description
     * Set the new favicon path
     * 
     * @param {string} path The path of the new favicon
     * 
     * @example
     * <pre>
     * function MyController(Favicon, FaviconType){
     *  Favicon.setFavicon(FaviconType.DEFAULT);
     *  Favicon.setFavicon('assets/favicons/new_favicon.ico');
     * }
     * </pre>
     */
    function setFavicon(path) {
        faviconSubscripionPromise.notify(path);
    }


    /**
     * @ngdoc
     * @name moliorApp.common.favicon.service:Favicon#onFaviconChange
     * @methodOf moliorApp.common.favicon.service:Favicon
     *
     * @description
     * Subscribe to favicon change events
     * @example
     * <pre>
     * Favicon.onFaviconChange().then(null, null, function(path){
     *  $ctrl.faviconPath = path; // "new/favicon-path.ico"
     * });
     * 
     * Favicon.setFavicon('new/favicon-path.ico');
     * </pre>
     * 
     * @returns {Promsie} Promise which gets called, when the Icon is set
     */
    function onFaviconChange() {
        return faviconSubscripionPromise.promise;
    }

    var service = {
        setFavicon: setFavicon,
        onFaviconChange: onFaviconChange
    };

    return service;
}
