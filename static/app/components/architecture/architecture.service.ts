import { MoliorAPI, MoliorApiResponse } from '@molior/core';
import { Architecture } from '@molior/components/architecture/interfaces';

/**
 * @ngdoc overview
 * @name moliorApp.components.architecture
 * @description
 * # moliorApp.components.architecture
 * This module handles architecture related stuff, such as
 *
 * @ngdoc service
 * @name moliorApp.components.architecture.service:architectureService
 * @description
 * Service for Architectures related requests /api/architectures
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class ArchitectureService
 * @extends {MoliorAPI}
 */
export class ArchitectureService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/architectures', $http, Log);
    }

    /**
     * Returns all architectures as a molior api response
     */
    public async all(): Promise<MoliorApiResponse<Architecture[]>> {
        return this.request({url: this.url});
    }
}
