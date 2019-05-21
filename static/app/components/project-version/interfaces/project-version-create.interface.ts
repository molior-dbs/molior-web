/**
 * The object for creating a new project version
 */
export interface ProjectVersionCreate {
    /**
     * Name of the version
     */
    name: string;
    /**
     * Array of architecture names
     */
    architectures: string[];
    /**
     * Array of basemirrors names
     */
    basemirror: string;
}
