import * as angular from 'angular';

describe('component: projectCreationForm', () => {
    let $componentController;
    let $rootScope;
    let $httpBackend;

    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module('ngMaterial'));
    beforeEach(angular.mock.module('mdSteppers'));
    beforeEach(angular.mock.module('moliorApp.common.log'));
    beforeEach(angular.mock.module('moliorApp.common.moliorHeader'));
    beforeEach(angular.mock.module('moliorApp.components.project.dashboard.navigation'));
    beforeEach(angular.mock.module('moliorApp.components.project'));
    beforeEach(angular.mock.module('moliorApp.components.project.creation'));
    beforeEach(angular.mock.module('moliorApp.components.project.version'));
    beforeEach(angular.mock.module('moliorApp.core'));
    beforeEach(angular.mock.module('moliorApp.util'));
    beforeEach(angular.mock.module('moliorApp.common.favicon'));

    // tslint:disable-next-line:variable-name
    beforeEach(inject((_$componentController_, _$rootScope_, _$q_, _$httpBackend_) => {
        $componentController = _$componentController_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    /**
     * Saving a project
     *
     * Userinput:
     *  Project:
     *      - name: rlx3
     *
     * Expected result:
     *  API calls:
     *      - POST /api/projects {name: 'rlx3'}
     */
    it('should create a project', (done) => {
        const ctrl = $componentController('projectCreationForm', {
            $scope: $rootScope,
        }, {
            project: {
                name: 'Test',
            },
        });

        ctrl.saveProject().then((data) => {
            expect(data).toBe('it worked!');
            done();
        });

        $httpBackend
            .expect('POST', '/api/projects', {
                name: 'Test',
            })
            .respond(200, 'it worked!');

        $httpBackend.flush();
    });

    /**
     * Saving a project and a project version
     *
     * Userinput:
     *  Project:
     *      - name: rlx3
     *  Version:
     *      - name: next
     *
     * Expected result:
     *  API calls:
     *      - POST /api/projects {name: 'rlx3'}
     *      - POST /api/project/1/versions  {name: 'next', project_id: 1}
     */
    it('should create a project and a project version', (done) => {
        const ctrl = $componentController('projectCreationForm', {
            $scope: $rootScope,
        }, {
            project: {
                name: 'rlx3',
            },
        });

        ctrl.saveAll({
            name: 'next',
        }).then((data) => {
            expect(data[0].id).toBe(1);
            expect(data[1]).toBe('it worked!');
            done();
        });

        $httpBackend
            .expect('POST', '/api/projects', {
                name: 'rlx3',
            })
            .respond(200, {
                id: 1,
            });

        $httpBackend
            .expect('POST', '/api/projects/1/versions', {
                name: 'next',
                project_id: 1,
            })
            .respond(200, 'it worked!');

        $httpBackend.flush();
    });
});
