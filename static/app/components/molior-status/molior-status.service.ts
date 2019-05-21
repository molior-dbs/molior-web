import { MoliorAPI } from '@molior/core';
import { MoliorStatusResponse } from './interfaces';

/**
 * Service for molior status related requests /api/status
 */
export class MoliorStatusService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/status', $http, Log);
    }

    public all(): Promise<MoliorStatusResponse> {
        return super.request({ method: 'GET' });
    }
}
