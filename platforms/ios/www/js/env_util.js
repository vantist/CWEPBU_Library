/* globals
define
 */
define([], function () {
    'use strict';

    var _userAgent = navigator.userAgent.toLowerCase(),
        ALL_DEVICE_LIST = [
            ['ipad', 'iphone'],
            ['android']
        ],
        _currentDevice,
        _deviceReadyPromise,
        DEVICE = {
            iOS: 0,
            Android: 1
        };

    function init() {
        identifyDevice();

        _deviceReadyPromise = new Promise(function (resolve) {
            document.addEventListener('deviceready', function () {
                resolve();
            }, false);
        });
    }

    function identifyDevice() {
        for (var i = ALL_DEVICE_LIST.length - 1; i >= 0; i--) {
            var deviceList = ALL_DEVICE_LIST[i];

            for (var j = deviceList.length - 1; j >= 0; j--) {
                if (_userAgent.indexOf(deviceList[j]) >= 0) {
                    _currentDevice = i;
                    return;
                }
            }
        }

        _currentDevice = DEVICE.Browser;
    }

    init();

    return {
        device: DEVICE,
        currentDevice: _currentDevice,
        isIOS: function () { return _currentDevice === DEVICE.iOS; },
        isAndroid: function () { return _currentDevice === DEVICE.iOS; },
        getDeviceReadyPromise: function () { return _deviceReadyPromise; }
    };
});
