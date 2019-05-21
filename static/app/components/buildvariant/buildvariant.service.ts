import { MoliorAPI, MoliorApiResponse } from '@molior/core';
import { Buildvariant } from './interfaces/buildvariant.interface';

/**
 * @ngdoc overview
 * @name moliorApp.components.buildvariant
 * @description
 * # moliorApp.components.buildvariant
 * This module handles buildvariant related stuff, such as
 *
 * @ngdoc service
 * @name moliorApp.components.buildvariant.service:BuildvariantService
 * @description
 * Service for Buildvariant related requests /api/buildvariants
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class BuildvariantService
 * @extends {MoliorAPI}
 */
export class BuildvariantService extends MoliorAPI {

    constructor($http, Log) {
        super('/api/buildvariants', $http, Log);
    }

    public all(params?: any): Promise<MoliorApiResponse<Buildvariant[]>> {
        return this.request<MoliorApiResponse<Buildvariant[]>>({ params, method: 'GET' });
    }

    public async byProjectversion(id): Promise<MoliorApiResponse<Buildvariant[]>> {
        return await this.request<MoliorApiResponse<Buildvariant[]>>({
            method: 'GET',
            url: `/api/buildvariants?projectversion_id=${id}`,
        });
    }

    public async byBasemirrorArch(
        basemirrorId: number,
        architectureId: number,
    ): Promise<MoliorApiResponse<Buildvariant[]>> {
        return this.request({
            url: this.url,
            params: {
                basemirror_id: basemirrorId,
                architecture_id: architectureId,
            },
        });
    }
}
