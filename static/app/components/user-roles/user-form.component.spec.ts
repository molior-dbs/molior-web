import * as angular from 'angular';
describe('component: userForm', () => {
    let $componentController;
    let $rootScope;
    let $httpBackend;

    beforeEach(angular.mock.module('moliorApp.common.log'));
    beforeEach(angular.mock.module('moliorApp.components.user.roles'));
    beforeEach(angular.mock.module('moliorApp.core'));
    beforeEach(angular.mock.module('moliorApp.util'));
    beforeEach(angular.mock.module('moliorApp.common.favicon'));
    beforeEach(angular.mock.module('moliorApp.components.user'));
    beforeEach(angular.mock.module('ngMaterial'));
    beforeEach(angular.mock.module('ui.router'));

    // tslint:disable-next-line:variable-name
    beforeEach(inject((_$componentController_, _$rootScope_, _$q_, _$httpBackend_) => {
        $componentController = _$componentController_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    /**
     * Add a user to a role
     *
     * Userinput:
     *  User:
     *      - userId: 1
     *  Role:
     *      - name: owner
     *  Project:
     *      - id: 1
     *
     * Expected result:
     *  API calls:
     *      - POST api/projects/1/users/1?role=owner
     */
    it('should add a user to a role', (done) => {
        const ctrl = $componentController('userForm', {
            $scope: $rootScope,
        }, {
            project: {
                id: 1,
            },
            query: {
                nameId: 1,
                role: 'owner',
            },
        });

        ctrl.add().then((data) => {
            // tslint:disable-next-line:no-console
            console.log(data);
            expect(data).toBe('it worked!');
            done();
        });

        $httpBackend
            .expect('PUT', '/api/projects/1/users/1', {
                role: 'owner',
        })
            .respond(200, 'it worked!');

        $httpBackend.flush();
    });
});
