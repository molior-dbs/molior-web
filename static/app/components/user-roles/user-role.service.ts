import { MoliorAPI } from '@molior/core';

/**
 * @ngdoc service
 * @name moliorApp.components.user.roles.service:UserRoleService
 * @description
 * Service for User Roles related requests /api/userroles
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.common.log.service:Log
 *
 * @class UserRoleService
 * @extends {MoliorAPI}
 */
export class UserRoleService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/userroles', $http, Log);
    }

    /**
     * Removes a user from a project
     *
     * @param {Number} projectId The id of the project
     * @param {Number} userId The id of the user
     * @returns {Promise} The $http promise
     */
    public remove(projectId: number, userId: number) {
        return super.request({ url: `/api/projects/${projectId}/users/${userId}`, method: 'DELETE' });
    }

    /**
     * Returns the projectrole of the user
     *
     * @param {Number} projectId The id of the project
     * @param {Number} userId The id of the user
     * @returns {Promise} The $http promise
     */
    public getProjectRoleByUser(projectId: number, userId: number) {
        return super.request({ url: `/api/projects/${projectId}/users/${userId}`});
    }

    /**
     * Adds a user with a role to the project
     *
     * @param {Number} projectId The project id to add the user
     * @param {Number} userId The user id to add
     * @param {String} roleName The role name as a string e.g. "owner"
     * @returns {Promise} The $http promise
     */
    public put(projectId, userId, roleName) {
        const url = `/api/projects/${projectId}/users/${userId}`;
        const data = {
            role: roleName,
        };
        return super.request({
            url,
            method: 'PUT',
            data,
        });
    }

    /**
     * Returns the roles of the given user id
     *
     * @param {Number} id The id of the user
     * @returns {Promise<Object>} The $http promise
     */
    public byUser(id: string) {
        const url = `/api/users/${id}/roles`;
        return super.request({ url, method: 'GET' });
    }

    /**
     * Gets all avalable user roles from the server
     */
    public all() {
        return super.request({ url: this.url });
    }
}
