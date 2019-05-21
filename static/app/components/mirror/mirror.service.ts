import { MoliorAPI, PaginationQuery, MoliorApiResponse } from '@molior/core';
import { MirrorItem } from './interfaces';
/**
 * @ngdoc service
 * @name moliorApp.components.mirror.service:MirrorService
 * @description
 * Service for Mirror related requests /api/mirror
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.common.log.service:Log
 *
 * @class MirrorService
 * @extends {MoliorAPI}
 */
export class MirrorService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/mirror', $http, Log);
    }

    public all(params: PaginationQuery)
        : Promise<MoliorApiResponse<MirrorItem[]>> {
        return this.request<MoliorApiResponse<MirrorItem[]>>({ params });
    }

    public update(mirrorId: number) {
        return this.request<any>({ url: `${this.url}/${mirrorId}`, method: 'PUT' });
    }

    public delete(mirrorId: number): Promise<string> {
        return this.request<string>({ url: `${this.url}/${mirrorId}`, method: 'DELETE' });
    }
}
