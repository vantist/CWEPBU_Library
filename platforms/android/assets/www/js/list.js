/* globals define: false */
define('list', ['jquery', 'configured_dust', 'debug'], function ($, dust, debug) {
    'use strict';

    var _$list,
        _selectedCallback = function () {},
        _deleteCallback = function () {},
        _previewCallback = function () {},
        _alwaysCallback = function () {},
        SELECTED_CLASSNAME = 'selected',
        LIST_TEMPLATE = 'list';


    function init($e) {
        _$list = $e;
        render();
        bindEvent();
    }

    function render(data) {
        dust.render(LIST_TEMPLATE, data, function dustRenderList(err, out) {
            if (err) {
                debug.error(err);
            } else {
                _$list.empty().append(out);
            }
        });
    }

    function bindEvent() {
        _$list.on('touchstart', 'tbody', function onListTouchStart(event) {
            var $target = $(event.target),
                $tr = $target.parents('tr'),
                id = Number($tr.attr('name'));

            _alwaysCallback.call(this);

            if ($tr.hasClass(SELECTED_CLASSNAME)) {
                id = -1;
            } else {
                clearSelected();
            }

            $tr.toggleClass(SELECTED_CLASSNAME);
            _selectedCallback.call(this, id);
        }).on('touchend', 'button.delete', function onDeleteButtonTouchend() {
            var id = Number($(this).attr('name'));

            _alwaysCallback.call(this);
            _deleteCallback.call(this, id);
        }).on('touchend', 'button.preview', function onPreivewButtonTouchend() {
            var id = Number($(this).attr('name'));

            _alwaysCallback.call(this);
            _previewCallback.call(this, id);
        });
    }

    function addSelectedEventListener(callback) {
        if (typeof callback === 'function') {
            _selectedCallback = callback;
        }
    }

    function addDeleteEventListener(callback) {
        if (typeof callback === 'function') {
            _deleteCallback = callback;
        }
    }

    function addPreviewEventListener(callback) {
        if (typeof callback === 'function') {
            _previewCallback = callback;
        }
    }

    function addAlwaysEventListener(callback) {
        if (typeof callback === 'function') {
            _alwaysCallback = callback;
        }
    }

    function clearSelected() {
        _$list.find('.' + SELECTED_CLASSNAME).removeClass(SELECTED_CLASSNAME);
    }

    return {
        init: init,
        render: render,
        eventHandler: {
            addSelectedEventListener: addSelectedEventListener,
            addDeleteEventListener: addDeleteEventListener,
            addPreviewEventListener: addPreviewEventListener,
            addAlwaysEventListener: addAlwaysEventListener
        },
        clearSelected: clearSelected
    };
});
