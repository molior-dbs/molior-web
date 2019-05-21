import { MoliorAPI } from '@molior/core';

/**
 * Service for Project related requests /api/repositories
 */
export class AppService extends MoliorAPI {

    constructor($http, Log) {
        super('/api/status', $http, Log);
    }

    /**
     * Triggers a git clone on the given repository
     * @returns {Promise} The $http promise
     */
    public status(): any {
        return super.request({ url: this.url });
    }
}
