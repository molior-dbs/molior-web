import { MoliorAPI, MoliorApiResponse } from '@molior/core';

/**
 * @ngdoc service
 * @name moliorApp.components.repository.service:RepositoryService
 * @description
 * Service for Project related requests /api/repositories
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class RepositoryService
 * @extends {MoliorAPI}
 */
export class RepositoryService extends MoliorAPI {

    constructor($http, Log) {
        super('/api/repositories', $http, Log);
    }

    /**
     * Triggers a git clone on the given repository
     * @param {Number} repositoryId The id of the repository
     * @returns {Promise} The $http promise
     */
    public clone(repositoryId: number) {
        return super.request({ method: 'POST', url: `/api/repositories/${repositoryId}/clone` });
    }

    /**
     * Triggers build latest on the given repository
     * @param {Number} repositoryId The id of the repository
     * @returns {Promise} The $http promise
     */
    public build(repositoryId) {
        return super.request({ method: 'POST', url: `/api/repositories/${repositoryId}/build` });
    }

    /**
     * Returns a repository belonging to a specific projectversion
     * @param repositoryId Id of the repository
     * @param projectVersionId Id of the projectversion the repo belongs to
     */
    public get(repositoryId: number, projectVersionId: number) {
        return super.request({
            method: 'GET',
            url: `/api/repositories/${repositoryId}`,
            data: { project_version_id: projectVersionId },
        });
    }

    public async all(params?: any): Promise<MoliorApiResponse<any>> {
        return super.request({
            params,
            url: this.url,
        });
    }

    public async byFilter(params: any): Promise<MoliorApiResponse<any>> {
        return super.request({
            url: this.url,
            params,
        });
    }

    public async byProjectVersionId(projectVersionId: number): Promise<MoliorApiResponse<any>> {
        return super.request({
            params: {
                project_version_id: projectVersionId,
            },
        });
    }
}
