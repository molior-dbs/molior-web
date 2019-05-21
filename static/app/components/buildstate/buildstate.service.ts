import { MoliorAPI, MoliorApiResponse } from '@molior/core';

/**
 * @ngdoc service
 * @name moliorApp.components.buildstate.service:BuildstateService
 * @description
 * Service for Buildstates related requests /api/buildstates
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class BuildstateService
 * @extends {MoliorAPI}
 */
export class BuildstateService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/buildstates', $http, Log);
    }

    public all(): Promise<MoliorApiResponse<string[]>> {
        return this.request<MoliorApiResponse<string[]>>({ method: 'GET' });
    }
}
