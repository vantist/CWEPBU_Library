/* globals
define
*/
define(['configured_dust', 'debug'], function (Dust, Debug) {
    'use strict';

    var _$loadingMask,
        LOADING_MASK_TEMPLAT = 'loading_mask';

    function init($e) {
        _$loadingMask = $e;
        render();
    }

    function render() {
        Dust.render(LOADING_MASK_TEMPLAT, {}, function dustRenderLoadingMask(err, out) {
            if (err) {
                Debug.error(err);
            } else {
                _$loadingMask.empty().append(out);
            }
        });
    }

    function show() {
        _$loadingMask.show();
    }

    function hide() {
        _$loadingMask.hide();
    }

    return {
        init: init,
        show: show,
        hide: hide
    };
});
