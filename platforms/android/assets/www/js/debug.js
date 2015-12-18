/* globals
define,
console
*/
define([], function () {
    'use strict';

    var DEBUG_MODE = true,
        _fakeConsole = {
            log: function () {},
            error: function () {},
            dir: function () {}
        },
        _console = console || _fakeConsole;

    function log(msg) {
        if (DEBUG_MODE) {
            _console.log(msg);
        }
    }

    function dir(msg) {
        if (DEBUG_MODE) {
            _console.dir(msg);
        }
    }

    function error(msg) {
        if (DEBUG_MODE) {
            _console.error(msg);
        }
    }

    return {
        log: log,
        dir: dir,
        error: error
    };
});
