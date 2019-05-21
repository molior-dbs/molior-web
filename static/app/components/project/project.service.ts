import { MoliorAPI, MoliorApiResponse, PaginationQuery } from '@molior/core';

import { ProjectDetail, ProjectOverviewItem } from './interfaces';

/**
 * @ngdoc service
 * @name moliorApp.components.project.service:ProjectService
 * @description
 * Service for Project related requests /api/projects
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.common.log.service:Log
 *
 * @class ProjectService
 * @extends {MoliorAPI}
 */
export class ProjectService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/projects', $http, Log);
    }

    /**
     * Returns the project with the given id
     * @param id The id of the project
     */
    public get(id: number): Promise<ProjectDetail> {
        return this.request({ url: `${this.url}/${id}` });
    }

    public byDeletedFilter(id: number, showDeleted: boolean) {
        return this.request({ url: `${this.url}/${id}`, params: { show_deleted: showDeleted } });
    }

    /**
     * Get all projects by pagination
     * @param params Search query
     */
    public all(params?: { q?: string, show_all?: boolean, count_only?: boolean }): Promise<MoliorApiResponse<ProjectOverviewItem[]>> {
        return this.request<MoliorApiResponse<ProjectOverviewItem[]>>({
            params,
        });
    }
}
