import { MoliorAPI } from '@molior/core';

/**
 * Service for release notes related requests /api/release-notes
 */
export class ReleaseNotesService extends MoliorAPI {
    constructor($http, Log) {
        super('/doc/release-notes.md', $http, Log);
    }

    /**
     * Returns the release notes as markdown
     */
    public async getReleaseNotes(): Promise<string> {
        return this.request({ method: 'GET' });
    }

    /**
     * Returns the release notes as markdown
     */
    public async getCurrentReleaseNotes(): Promise<string> {
        return this.request({ url: `/doc/current-release-notes.md`, method: 'GET' });
    }
}
