import { IHttpService } from 'angular';

import { MoliorAPI, MoliorApiResponse } from '@molior/core';

import { ProjectVersionDetail, ProjectVersionQuery, ProjectVersionCreate, ProjectVersionCreateResponse } from './interfaces';

/**
 * @ngdoc service
 * @name moliorApp.components.project.version.service:ProjectVersionService
 * @description
 * Service for Project related requests /api/projectversions
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class ProjectVersionService
 * @extends {MoliorAPI}
 */
export class ProjectVersionService extends MoliorAPI {

    constructor(
        $http: IHttpService,
        Log) {
        super('/api/projectversions', $http, Log);
        this.logger = Log.init('ProjectVersionService');
    }

    /**
     * Returns a promis which resolves to all available projectversions
     */
    public async all(params?: ProjectVersionQuery)
        : Promise<MoliorApiResponse<ProjectVersionDetail[]>> {
        return this.request({ url: this.url, params });
    }

    public async byDependant(dependantId: number)
        : Promise<MoliorApiResponse<ProjectVersionDetail[]>> {
        return this.request({ url: this.url, params: { dependant_id: dependantId }});
    }

    /**
     * Adds a dependency to a projectversion
     * @param projectVersionId The project version to add the dependency to
     * @param dependencyId The id of the dependency
     */
    public async addDependency(projectVersionId: number, dependencyId: number) {
        return await this.request({
            method: 'POST',
            url: `${this.url}/${projectVersionId}/dependency`,
            data: {
                dependency_id: dependencyId,
            },
        });
    }

    /**
     * Creates a copy of a projectversion
     * @param projectVersionId The project to copy
     * @param name The name of the copied version
     */
    public async copy(projectVersionId: number, name: string) {
        return await this.request({
            method: 'POST',
            url: `${this.url}/${projectVersionId}/clone`,
            data: { name },
        });
    }

    /**
     * Creates an overlay of a projectversion
     * @param projectVersionId The project version to create the overlay from
     * @param name Name of the overlay version
     */
    public async createOverlay(projectVersionId: number, name: string) {
        return await this.request({
            method: 'POST',
            url: `${this.url}/${projectVersionId}/overlay`,
            data: { name },
        });
    }

    /**
     * Returns the user with the given id
     * @param id The id of the user
     */
    public get(id: number): Promise<ProjectVersionDetail> {
        return this.request({ url: `${this.url}/${id}` });
    }

    /**
     * Create a project version
     *
     * @param {number} projectId The id of the project
     * @param {any} data The projectversion to post
     * @returns {Promise} The $http promise
     */
    public async create(projectId: number, data: ProjectVersionCreate): Promise<ProjectVersionCreateResponse> {
        return await this.request({
            url: `/api/projects/${projectId}/versions`,
            data: {
                name: data.VersionName,
                basemirror: data.BasemirrorName,
                architectures: data.Architectures,
            },
            method: 'POST' });
    }

    /**
     * Locks a project version
     *
     * @param {number} projectVersionId  The id of the project version
     * @returns {Promise} The $http promise
     */
    public async lock(projectVersionId: number): Promise<any> {
        return await this.request({ url: `${this.url}/${projectVersionId}/lock`, method: 'POST' });
    }

    /**
     * The projectversion to delete
     * @param id Id of the project version to delete
     */
    public async delete(id: any): Promise<any> {
        return this.request({
            method: 'PUT',
            url: `${this.url}/${id}/mark-delete`,
        });
    }

    /**
     * Toggles the Ci enabled flag on the projectversion
     *
     * @param {number} projectVersionId  The id of the project version
     * @returns {Promise} The $http promise
     */
    public async toggleCi(projectVersionId: number): Promise<any> {
        return await this.request({ url: `${this.url}/${projectVersionId}/toggleci`, method: 'POST' });
    }

    /**
     * Adds a sourcerepository to the given project version
     *
     * @param {number} projectId The id of the project
     * @param {number} projectVersionId The id of the project version
     * @param {any} repository Array of buildvariants ids
     * @returns {Promise} The $http promise
     */
    public async postSourceRepository(projectVersionId: number, repository: any) {
        const url = `/api/projectversions/${projectVersionId}/repositories/${repository.id}`;
        return await this.request({ url, method: 'POST', data: repository });
    }

    /**
     * Deletes a Repository from the projectversion
     * @param {Number} repositoryId The id of the repository
     * @returns {Promise} The $http promise
     */
    public deleteSourceRepository(projectversionId: number, repositoryId: number) {
        return super.request({ method: 'DELETE', url: `/api/projectversions/${projectversionId}/repositories/${repositoryId}`});
    }

    /**
     * Deletes a projectversion dependency
     * @param projectVersionId The id of the projectversion to add the dependency to
     * @param dependencyId The id of the dependency
     */
    public async deleteDependency(projectVersionId: number, dependencyId: number) {
        return await this.request({
            method: 'DELETE',
            url: `/api/projectversions/${projectVersionId}/dependency`,
            data: {
                dependency_id: dependencyId,
            },
        });
    }
}
