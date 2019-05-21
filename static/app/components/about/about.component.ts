import './about.style.scss';
import { IComponentOptions, IRootScopeService } from 'angular';
import { MoliorApiResponse } from '@molior/core';
import { RepositoryService } from '../repository/repository.service';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

class AboutController {

    public totalRepositories: MoliorApiResponse<any>;
    public totalUsers: MoliorApiResponse<any>;
    public totalProjects: MoliorApiResponse<any>;

    constructor(
        private RepositoryService: RepositoryService,
        private UserService: UserService,
        private ProjectService: ProjectService,
        private $scope: IRootScopeService,
    ) { }

    /**
     * Loads all the needed data and binds it to the controller
     */
    public async $onInit() {
        // Fetch all the data simuntanousely
        const promises: Array<Promise<MoliorApiResponse<any>>> = [
            this.RepositoryService.all({ count_only: true }),
            this.UserService.all({ count_only: true }),
            this.ProjectService.all({ count_only: true, show_all: true }),
        ];

        const [totalRepositories, totalUsers, totalProjects] = await Promise.all(promises);
        this.totalRepositories = totalRepositories;
        this.totalUsers = totalUsers;
        this.totalProjects = totalProjects;
        this.$scope.$apply();
    }
}

/**
 * This component displays the about page.
 *
 * @param {Object} totalRepositories The total amount of repositories
 * @param {Object} totalUsers The total amount of users
 * @param {Object} totalProject The total amount of projects
 */
export const AboutComponent: IComponentOptions = {
    template: `
<section class="about">
    <section class="small-container">
        <h2>About</h2>
        <p class="paragraph">
            The purpose of molior is to build Debian packages out of git repositories based on a mirror of a specific Debian version and therefore creating reproducible builds. Build environments are structured into projects and versions, which may include mirrors and versions of other projects.
        </p>

        Molior performs the following tasks:
        <ul>
            <li>create mirrors of Debian repositories</li>
            <li>create projects based on a Debian mirror, include dependencies to other projects or mirrors</li>
            <li>build packages into project repositories (i386, amd64, armhf, arm64)</li>
            <li>create deployments of projects (ISO Installer, VirtualBox, images, ...)</li>
        </ul>
    </section>
    <section class="buckets-wrapper">
        <ul layout="row" flex layout-wrap layout-align="center center" class="small-container buckets">
            <li flex="20">
                <md-button layout="column" href="/userdoc/source" target="_blank">
                    <ng-md-icon icon="subject" size="30"></ng-md-icon>
                    <span flex>User Docs</span>
                </md-button>
            </li>
            <li flex="20">
                <md-button layout="column" href="/api/doc" target="_blank">
                    <ng-md-icon icon="subject" size="30"></ng-md-icon>
                    <span flex>Backend Docs</span>
                </md-button>
            </li>
            <li flex="20">
                <md-button layout="column" href="/release-notes">
                    <ng-md-icon icon="access_time" size="30"></ng-md-icon>
                    <span flex>Release Notes</span>
                </md-button>
            </li>
        </ul>
    </section>
    <section class="small-container">
        <h2>Statistics</h2>
        <md-card>
            <md-card-content>
                <build-chart type="year"></build-chart>
            </md-card-content>
        </md-card>
        <section layout="row">
            <build-count-card flex ui-sref="build.overview({buildstate: 'successful'})" type="success"></build-count-card>
            <build-count-card flex ui-sref="build.overview({buildstate: ['publish_failed', 'build_failed']})" type="failed"></build-count-card>
            <build-count-card flex ui-sref="build.overview" type="total"></build-count-card>
        </section>
        <md-card layout-padding>
            <md-card-content>
                <div layout-padding flex layout="row" layout-align="center center" layout-margin>
                    <div flex layout="column" layout-align="center center">
                        <strong class="card-stats-number" ng-bind="$ctrl.totalUsers.total_result_count"></strong>
                        <span>Users</span>
                    </div>
                    <div flex layout="column" layout-align="center center">
                        <strong class="card-stats-number" ng-bind="$ctrl.totalRepositories.total_result_count"></strong>
                        <span>Repositories</span>
                    </div>
                    <div flex layout="column" layout-align="center center">
                        <strong class="card-stats-number" ng-bind="$ctrl.totalProjects.total_result_count"></strong>
                        <span>Projects</span>
                    </div>
                </div>
            </md-card-content>
        </md-card>
    </section>
</section>`,
    controller: AboutController,
};
