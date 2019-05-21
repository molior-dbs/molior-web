import { IHttpService, IRequestConfig } from 'angular';

/**
 * The options for requesting throught the internal
 * request method.
 *
 * Overrides the IRequestConfig and makes method and url optional
 */
export interface RequestOptions extends Partial<IRequestConfig> {
    method?: string;
    url?: string;
}

export class MoliorAPI {
    protected logger;
    /**
     * Creates an instance of MoliorAPI.
     * @param {String} url The url to send GET / POST / PUT / DELETE requests
     * @param {Object} $http AngularJS HTTP Service
     * @param {Object} $q AngularJS q Service
     * @param {LogFactory} Log Log Service
     * @memberof MoliorAPI
     */
    constructor(
        protected readonly url: string,
        private readonly $http: IHttpService,
        Log) {
        this.logger = Log.init('MoliorAPI', '#52b700');
    }

    /**
     * Posts the given item
     *
     * @param {Object} data The item to save for the specific topic
     * @returns {Promise} The http promise
     *
     * @memberof MoliorAPI
     */
    public async post<T = any>(data: any): Promise<T> {
        return await this.request<T>({ data, method: 'POST' });
    }

    /**
     * Updates the given item
     *
     * @param {number} id The id of the object to update
     * @param {any} params The url parameters
     * @param {any} data The item to save for the specific topic
     *
     * @returns {Promise} The http promise
     *
     * @memberof MoliorAPI
     */
    public async update<T>(id: number, params: any, data?: any): Promise<T> {
        return await this.request<T>({ url: `${this.url}/${id}`, method: 'PUT', params, data });
    }

    /**
     * Executes a HTTP request and logs it
     *
     * @param {RequestOptions} options The options of the HTTP request
     */
    protected async request<T = any>(options: RequestOptions): Promise<T> {
        const requestOptions: IRequestConfig = {
            ...options,
            url: options && options.url || this.url,
            method: options && options.method || 'GET',
         };

        const { method, url, params } = requestOptions;
        let response;

        this.logger.info(`Sending ${method}-request ${url}:`, params);

        try {
            response = await this.$http<T>(requestOptions);
        } catch (err) {
            this.logger.error(`Failed receiving ${options.method}-response ${url}`, err);
            throw err;
        }

        this.logger.info(`Received ${method}-response ${url}:`, response);
        return response.data;
    }
}
