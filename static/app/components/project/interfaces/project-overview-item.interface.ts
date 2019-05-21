/**
 * Represents one item of a non-detailed list of projects
 */
export interface ProjectOverviewItem {
    /**
     * The name of the project e.g. molior
     */
    name: string;
    /**
     * The id of the project
     */
    id: number;
    /**
     * The description of the project
     */
    description?: string;
}
