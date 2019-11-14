import { MoliorAPI } from '@molior/core';
import { IHttpService } from 'angular';
import { Node } from './interfaces';

/**
 * @ngdoc service
 * @name moliorApp.components.node.service:NodeService
 * @description
 * Service for Node related requests /api/nodes
 *
 * @requires $q
 * @requires $http
 * @requires moliorApp.log.service:Log
 *
 * @class NodeService
 * @extends {MoliorAPI}
 */
export class NodeService extends MoliorAPI {

    constructor($http: IHttpService, Log) {
        super('/api/nodes', $http, Log);
    }

    public all(params?: any): any {
        return super.request({ url: this.url, params });
    }
}
