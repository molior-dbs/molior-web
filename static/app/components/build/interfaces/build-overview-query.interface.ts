export interface BuildOverviewQuery {
    page: number;
    per_page: number;
    currently_failing: boolean;
    from: string;
    project_version_id?: number;
    sourcerepository: string;
    version: string;
    maintainer: string;
    startstamp: string;
    buildstate: string;
    buildvariant: string;
    architecture?: string;
    sourcerepository_id: string;
}
