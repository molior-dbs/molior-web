/**
 * The query parameters for requesting things with pagination
 */
export interface PaginationQuery {
    /**
     * The size of the page
     */
    page_size: number;
    /**
     * The page
     */
    page: number;
    /**
     * The search query
     */
    q: string;
}
