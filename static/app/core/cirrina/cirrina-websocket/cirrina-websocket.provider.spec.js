import * as angular from 'angular';

describe('service: cirrinaWebsocket', () => {
    let CirrinaWebsocket,
        mockNgSocket,
        $location,
        CirrinaStatus,
        mockWEBSOCKET_STATUS;

    beforeEach(angular.mock.module('ngMaterial'));
    beforeEach(angular.mock.module('ngMdIcons'));
    beforeEach(angular.mock.module('ngSocket'));
    beforeEach(angular.mock.module('moliorApp'));
    beforeEach(angular.mock.module('moliorApp.common.log'));
    beforeEach(angular.mock.module('moliorApp.core'));
    beforeEach(angular.mock.module('moliorApp.core.cirrina'));
    beforeEach(angular.mock.module('rx'));



    beforeEach(angular.mock.module(($provide) => {
        mockNgSocket = jasmine.createSpy('ngSocket').and.callFake(() => () => {
            return {
                send: jasmine.createSpy('send'),
                onOpen: jasmine.createSpy('onOpen'),
                socket: {},
                onMessage: jasmine.createSpy('onMessage'),
            };
        });

        $provide.service('ngSocket', mockNgSocket);
    }));

    describe('injecting', () => {
        beforeEach(inject((_$rootScope_, _CirrinaWebsocket_, _$location_) => {
            CirrinaWebsocket = _CirrinaWebsocket_;
            $location = _$location_;
        }));

        it('should connect with websocket only once', inject(() => {
            expect(mockNgSocket.calls.count()).toBe(1);
        }));
    });

    describe('service: cirrinaWebsocket changes cirrinaStatus', () => {
        beforeEach(angular.mock.module(($provide) => {
            mockWEBSOCKET_STATUS = {
                DISCONNECTED: 0,
                CONNECTED: 1
            };
            $provide.constant('WEBSOCKET_STATUS', mockWEBSOCKET_STATUS);
        }));
        beforeEach(inject((_CirrinaWebsocket_, _CirrinaStatus_) => {
            CirrinaWebsocket = _CirrinaWebsocket_;
            CirrinaStatus = _CirrinaStatus_;
        }));
        it('should change the status to connected on ws open', () => {
            CirrinaWebsocket.onOpenHandler();
            expect(CirrinaStatus.status).toBe(mockWEBSOCKET_STATUS.CONNECTED);
        });
        it('should change the status to disconnected on ws close', () => {
            CirrinaWebsocket.onCloseHandler();
            expect(CirrinaStatus.status).toBe(mockWEBSOCKET_STATUS.DISCONNECTED);
        });
    });

    describe('service: cirrinaWebsocket.getWebsocketUrl', () => {
        beforeEach(inject((_$rootScope_, _CirrinaWebsocket_, _$location_) => {
            CirrinaWebsocket = _CirrinaWebsocket_;
            $location = _$location_;
        }));
        it('should create the correct websocket https url', () => {
            spyOn($location, 'protocol').and.returnValue('https');
            spyOn($location, 'host').and.returnValue('localhost');
            let url = CirrinaWebsocket.getWebsocketUrl('/api/websocket');
            expect(url).toBe('wss://localhost/api/websocket');
        });

        it('should create the correct websocket http url', () => {
            spyOn($location, 'protocol').and.returnValue('http');
            spyOn($location, 'host').and.returnValue('localhost');
            let url = CirrinaWebsocket.getWebsocketUrl('/api/websocket');
            expect(url).toBe('ws://localhost/api/websocket');
        });
    });

    describe('service: cirrinaWebsocket Messaging', () => {
        beforeEach(inject((_CirrinaWebsocket_) => {
            CirrinaWebsocket = _CirrinaWebsocket_;
        }));
        it('should notify when subscribed to onMessage', done => {
            CirrinaWebsocket
                .onMessage()
                .subscribe((message) => {
                    expect(message.foo).toBe('bar');
                    done();
                });
            CirrinaWebsocket.onMessageHandler({
                data: '{"foo": "bar"}'
            });
        });
    });
});
