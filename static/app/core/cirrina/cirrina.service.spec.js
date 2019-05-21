import * as angular from 'angular';

describe('service: cirrina', () => {
    var Cirrina,
        mockCirrinaSubject,
        mockCirrinaEvent,
        mockCirrinaWebsocket;

    beforeEach(angular.mock.module('moliorApp.common.log'));
    beforeEach(angular.mock.module('moliorApp.core'));
    beforeEach(angular.mock.module('moliorApp.core.cirrina'));
    beforeEach(angular.mock.module('ngMaterial'));
    beforeEach(angular.mock.module('rx'));


    beforeEach(angular.mock.module(($provide) => {
        mockCirrinaSubject = {
            WEBSOCKET: 1,
            EVENTWATCH: 2,
            USERROLE: 3,
            USER: 4,
            PROJECT: 5,
            PROJECTVERSION: 6,
            BUILD: 7,
            LIVELOG: 8
        };

        mockCirrinaEvent = {
            ADDED: 1,
            CHANGED: 2,
            REMOVED: 3,
            CONNECTED: 4
        };
        mockCirrinaWebsocket = jasmine.createSpy('CirrinaWebsocket').and.callFake(() => {
            return {
                send() {

                },
                connect: jasmine.createSpy('Connect'),
                onMessage() {
                    return {
                        subscribe(func) {
                            setTimeout(() => {
                                func({
                                    subject: mockCirrinaSubject.BUILD,
                                    event: mockCirrinaEvent.ADDED,
                                    data: true
                                });
                            }, 5);
                        }
                    };
                },
                onClose() {
                    return {
                        subscribe(func) {
                            setTimeout(() => {
                                func();
                            }, 5);
                        }
                    };
                }
            };
        });

        $provide.service('CirrinaWebsocket', mockCirrinaWebsocket);
        $provide.service('CirrinaSubject', mockCirrinaSubject);
        $provide.service('CirrinaEvent', mockCirrinaEvent);
    }));

    beforeEach(inject((_$rootScope_, _$q_, _Cirrina_) => {
        Cirrina = _Cirrina_;
    }));


    it('should notify all subscribers', done => {
        Cirrina
            .when(Cirrina.subject.BUILD, Cirrina.event.ADDED)
            .then()
            .subscribe(message => {
                expect(message).toBe(true);
                done();
            });
        Cirrina
            .when(Cirrina.subject.BUILD, Cirrina.event.ADDED)
            .then()
            .subscribe(message => {
                expect(message).toBe(true);
                done();
            });
    });

    it('should not notify when unsubscribed', done => {
        let onBuildAdd = Cirrina
            .when(Cirrina.subject.BUILD, Cirrina.event.ADDED);

        let callback = jasmine.createSpy('callback').and.callFake(() => { });

        onBuildAdd
            .then()
            .subscribe(callback);
        onBuildAdd
            .unsubscribe();

        setTimeout(() => {
            expect(callback).not.toHaveBeenCalled();
            done();
        }, 13);
    });

    it('should send a message', inject((CirrinaWebsocket) => {
        spyOn(CirrinaWebsocket, 'send');
        Cirrina
            .emit(Cirrina.subject.BUILD, Cirrina.action.STOP, {
                foo: 'bar'
            });
        expect(CirrinaWebsocket.send).toHaveBeenCalledWith({
            subject: Cirrina.subject.BUILD,
            action: Cirrina.action.STOP,
            data: {
                foo: 'bar'
            }
        });
    }));
});
