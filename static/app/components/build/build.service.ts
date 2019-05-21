import { MoliorAPI, MoliorApiResponse } from '@molior/core';
import { BuildOverviewItem, BuildOverviewQuery } from './interfaces';

/**
 * @ngdoc service
 * @name moliorApp.components.build.service:BuildService
 * @description
 * Service for Build related requests /api/builds
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class BuildService
 * @extends {MoliorAPI}
 */
export class BuildService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/builds', $http, Log);
    }

    public all(params: BuildOverviewQuery): Promise<MoliorApiResponse<BuildOverviewItem[]>> {
        return this.request({ method: 'GET', params });
    }

    public getLog(id): Promise<string> {
        return this.request<string>({ url: `buildout/${id}/build.log` });
    }

    public byId(id: number): Promise<any> {
        return this.request({ url: `${this.url}/${id}` });
    }

    /**
     * Removes the build with the given id
     * @param id The id of the build
     */
    public remove(id: number): Promise<any> {
        return this.request({ method: 'DELETE', url: `${this.url}/${id}` });
    }
}
