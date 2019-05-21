import { MoliorAPI } from '../molior-api.service';

export class MoliorInfoService extends MoliorAPI {
    constructor($http, Log) {
        super('/api/info', $http, Log);
        this.logger = Log.init('MoliorInfoService');
    }

    public getAptlyhostname(): Promise<any> {
        return this.request({ url: `${this.url}/aptlyhostname` });
    }
}
