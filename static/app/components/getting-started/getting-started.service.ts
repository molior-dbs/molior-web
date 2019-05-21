import { MoliorAPI } from '@molior/core';

/**
 * @ngdoc service
 * @name moliorApp.components.gettingStarted.service:GettingStartedService
 * @description
 * Service for getting started related requests /api/getting-started
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class GettingStartedService
 * @extends {MoliorAPI}
 */
export class GettingStartedService extends MoliorAPI {
    constructor($http, Log) {
        super('/doc/getting-started.md', $http, Log);
    }

    public all(): Promise<string> {
        return super.request<string>({ method: 'GET' });
    }
}
