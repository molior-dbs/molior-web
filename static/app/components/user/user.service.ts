import { MoliorAPI } from '@molior/core';
import { IHttpService } from 'angular';
import { User } from './interfaces';

/**
 * @ngdoc service
 * @name moliorApp.components.user.service:UserService
 * @description
 * Service for User related requests /api/users
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class UserService
 * @extends {MoliorAPI}
 */
export class UserService extends MoliorAPI {

    constructor($http: IHttpService, Log) {
        super('/api/users', $http, Log);
    }

    /**
     * Returns the user with the given id
     * @param id The id of the user
     */
    public get(id: number): Promise<User> {
        return this.request({ url: `${this.url}/${id}` });
    }

    /**
     * Returns the current user
     */
    public getCurrentUser(): Promise<User> {
        return this.get(-1);
    }

    /**
     * Returns the users of the given project and their corresponding
     * roles
     *
     * @param {Number} id The project id
     * @param {Object} params The query parameter
     * @param {Number} params.page The page number
     * @param {Number} params.page_size The size of one page
     * @param {String} params.filter_name The name to filter
     * @param {String} params.filter_role The role to filter
     *
     * @memberof UserService
     */
    public byProject(id, params) {
        return super.request({ url: `/api/projects/${id}/users`, params });
    }

    /**
     * Adds a new user
     * @param user The user to add
     */
    public add(user: User) {
        return super.request({
            method: 'POST',
            data: user,
        });
    }

    public all(params?: any): any {
        return super.request({ url: this.url, params });
    }
}
