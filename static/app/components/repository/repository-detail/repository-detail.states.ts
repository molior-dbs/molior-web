import { BuildvariantService } from '../../buildvariant/buildvariant.service';
import { RepositoryService } from '../repository.service';
import { StateParams } from '@uirouter/core';
import { ProjectVersionDetail } from '@molior/components/project-version/interfaces';
import { Ng1StateDeclaration } from '@uirouter/angularjs';

export const detailState: Ng1StateDeclaration  = {
    name: 'project-version.repository.detail',
    url: '/repository/:repositoryId',
    component: 'repositoryDetail',
    data: {
        requiresAuth: true,
    },
    resolve: {
        repository: (
            RepositoryService: RepositoryService,
            $stateParams: StateParams,
            version: ProjectVersionDetail,
        ) => RepositoryService.get($stateParams.repositoryId, version.id),
        buildvariants: (BuildvariantService: BuildvariantService) => BuildvariantService.all(),
    },
};
