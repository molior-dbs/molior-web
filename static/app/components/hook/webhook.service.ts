import { MoliorAPI } from '@molior/core';

/**
 * @ngdoc service
 * @name moliorApp.components.hook.service:WebhookService
 * @description
 * Service for Hook related requests /api/doc
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class WebookService
 * @extends {MoliorAPI}
 */
export class WebhookService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/hooks', $http, Log);
    }

    /**
     * Returns the markdown guide
     * @returns {Promise} The $http promise
     */
    public guide(): Promise<string> {
        return super.request<string>({ url: '/doc/getting-started.md' });
    }

    /**
     * Updates a webhook
     * @param {Number} hookId The hook's id to be updated
     * @param {object} item The hook's updated data
     * @returns {Promise} The $http promise
     */
    public put(hookId: number, params: any): Promise<any> {
        return super.request<any>({
            method: 'PUT',
            url: `/api/hooks/${hookId}`,
            data: params,
        });
    }

    public remove(hookId: number): Promise<any> {
        return super.request<any>({
            method: 'DELETE',
            url: `/api/hooks/${hookId}`,
        });
    }

}
