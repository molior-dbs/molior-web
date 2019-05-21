import { ReleaseNotesService } from './release-notes.service';
import { Ng1StateDeclaration } from '@uirouter/angularjs';

export const releaseNotesState: Ng1StateDeclaration = {
    parent: 'app',
    name: 'release-notes',
    url: '/release-notes',
    component: 'releaseNotes',
    data: {
        requiresAuth: true,
    },
    resolve: {
        releaseNotes: (ReleaseNotesService: ReleaseNotesService) => ReleaseNotesService.getReleaseNotes(),
        currentReleaseNotes: (ReleaseNotesService: ReleaseNotesService) => ReleaseNotesService.getCurrentReleaseNotes(),
    },
};
