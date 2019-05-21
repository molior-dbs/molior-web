import * as angular from 'angular';

describe('component: mirrorForm', () => {
    let $componentController;
    let $rootScope;
    let $httpBackend;

    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module('moliorApp.common'));
    beforeEach(angular.mock.module('moliorApp.components'));
    beforeEach(angular.mock.module('moliorApp.core'));
    beforeEach(angular.mock.module('moliorApp.util'));
    beforeEach(angular.mock.module('mdSteppers'));
    beforeEach(angular.mock.module('ngMaterial'));

    // tslint:disable-next-line:variable-name
    beforeEach(inject((_$componentController_, _$rootScope_, _$httpBackend_) => {
        $componentController = _$componentController_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    /**
     * Create a mirror
     *
     * Userinput:
     *  Mirror:
     *      - name: test-mirror
     *      - url: https://mirror.ch
     *      - distribution: jessie
     *      - components: main
     *      - key: key1,key2
     *      - keyserver: http://keyserver.ch
     *      - architectures: amd64, i386
     *      - is base mirror: true
     *      - download udebs: true
     *      - download sources: false
     *
     * Expected result:
     *  API calls:
     *      - POST api/projects {
     *           name: 'test-mirror',
     *           url: 'https://mirror.ch',
     *           distribution: 'jessie',
     *           components: 'main',
     *           keys: ['my', 'keys'],
     *           keyserver: 'http://keyserver.ch',
     *           architectures: 'amd64,i386',
     *           is_basemirror: true,
     *           version: '1',
     *           download_udebs: true,
     *           download_sources: false
     *       }
     */
    it('should create a mirror', () => {
        const ctrl = $componentController('mirrorForm', {
            $scope: $rootScope,
        });

        ctrl.architectures = [{ name: 'amd64' }, { name: 'i386' }];
        ctrl.ngModel.is_basemirror = true;
        ctrl.create({
            name: 'test-mirror',
            url: 'https://mirror.ch',
            distribution: 'jessie',
            components: ['main'],
            keys: ['my', 'keys'],
            keyserver: 'http://keyserver.ch',
            is_basemirror: true,
            version: '1',
            architectures: ['amd64'],
            download_udebs: true,
            download_sources: false,
        }, 1);

        $httpBackend
            .expect('POST', '/api/mirror', {
                name: 'test-mirror',
                url: 'https://mirror.ch',
                distribution: 'jessie',
                components: ['main'],
                keys: ['my', 'keys'],
                keyserver: 'http://keyserver.ch',
                is_basemirror: true,
                version: '1',
                architectures: ['amd64'],
                download_udebs: true,
                download_sources: false,
            })
            .respond(200, 'it worked!');
    });

    it('should create a mirror with a armored key url', () => {
        const ctrl = $componentController('mirrorForm', {
            $scope: $rootScope.$new(),
        });

        ctrl.architectures = [{ name: 'amd64' }, { name: 'i386' }];
        ctrl.ngModel.is_basemirror = true;
        ctrl.create({
            name: 'test-mirror',
            url: 'https://mirror.ch',
            distribution: 'jessie',
            components: ['main'],
            armored_key_url: 'http://keyserver.ch',
            is_basemirror: true,
            version: '1',
            architectures: ['amd64'],
        }, 0);
        $httpBackend
            .expect('POST', '/api/mirror', {
                name: 'test-mirror',
                url: 'https://mirror.ch',
                distribution: 'jessie',
                components: ['main'],
                armored_key_url: 'http://keyserver.ch',
                is_basemirror: true,
                version: '1',
                architectures: ['amd64'],
            })
            .respond(200, 'it worked!');
        $httpBackend.flush();
    });
});
