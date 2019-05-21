import * as angular from 'angular';

describe('service: cirrinaStatus', () => {
    var CirrinaStatus,
        WEBSOCKET_STATUS;

    beforeEach(angular.mock.module('moliorApp.common.log'));
    beforeEach(angular.mock.module('moliorApp.core'));
    beforeEach(angular.mock.module('moliorApp.core.cirrina.status'));
    beforeEach(angular.mock.module('ngMaterial'));
    beforeEach(angular.mock.module('rx'));

    beforeEach(inject((_$rootScope_, _$q_, _CirrinaStatus_, _WEBSOCKET_STATUS_) => {
        CirrinaStatus = _CirrinaStatus_;
        WEBSOCKET_STATUS = _WEBSOCKET_STATUS_;
    }));

    it('should receive status updates', done => {
        CirrinaStatus.subscribe((update) => {
            expect(update).toBe(WEBSOCKET_STATUS.CONNECTED);
            done();
        });

        CirrinaStatus.status = WEBSOCKET_STATUS.CONNECTED;
    });
    it('should receive status updates when subscribed multiply', done => {
        CirrinaStatus.subscribe((update) => {
            expect(update).toBe(WEBSOCKET_STATUS.DISCONNECTED);
        });

        CirrinaStatus.subscribe((update) => {
            expect(update).toBe(WEBSOCKET_STATUS.DISCONNECTED);
            done();
        });

        CirrinaStatus.status = WEBSOCKET_STATUS.DISCONNECTED;
    });

    it('should update the status', () => {
        CirrinaStatus.status = WEBSOCKET_STATUS.CONNECTED;
        expect(CirrinaStatus.status).toBe(WEBSOCKET_STATUS.CONNECTED);
    });
});
