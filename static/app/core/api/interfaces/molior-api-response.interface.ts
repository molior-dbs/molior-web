/**
 * A response of the molior api
 */
export interface MoliorApiResponse<T> {
    /**
     * The results
     */
    results: T;
    /**
     * The amount of results
     */
    total_result_count;
}
