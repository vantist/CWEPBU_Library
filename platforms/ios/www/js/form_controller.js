/* globals
define
*/
define(['jquery', 'configured_dust', 'debug'], function ($, Dust, Debug) {
    'use strict';

    var _$form,
        _saveCallback = function () {},
        _deleteCallback = function () {},
        _updateCallback = function () {},
        _cancelCallback = function () {},
        _previewCallback = function () {},
        _alwaysCallback = function () {},
        CREATE_TEMPLATE = 'create_form',
        EDIT_TEMPLATE = 'edit_form';

    function init($e) {
        _$form = $e;
        render();
        bindEvent();
    }

    function render(book) {
        var template = (book === undefined) ? CREATE_TEMPLATE : EDIT_TEMPLATE;

        _$form.empty();
        Dust.render(
            template,
            book,
            function (err, out) {
                if (err) {
                    Debug.error(err);
                } else {
                    _$form.append(out);
                }
            }
        );
    }

    function getBookData() {
        var book = {
            id: Number(_$form.find('input[name="id"]').val()),
            title: _$form.find('input[name="title"]').val(),
            isbn: _$form.find('input[name="isbn"]').val(),
            filename: _$form.find('input[name="filename"]').val()
        };

        return book;
    }

    function bindEvent() {
        _$form.on('touchend', 'button[name="save"]', function onSaveButtonTouchend() {
            var $file = _$form.find('input[type="file"]'),
                files = ($file.length === 0) ? undefined : $file[0].files;

            _alwaysCallback.call(this);
            _saveCallback.call(this, getBookData(), files);
        }).on('touchend', 'button[name="clear"]', function onClearButtonTouchend() {
            _$form.find('input').val('');
        }).on('touchend', 'button[name="delete"]', function onDeleteButtonTouchend() {
            var book = getBookData();

            _alwaysCallback.call(this);
            _deleteCallback.call(this, book.id);
        }).on('touchend', 'button[name="update"]', function onUpdateButtonTouchend() {
            var $file = _$form.find('input[type="file"]'),
                files = ($file.length === 0) ? undefined : $file[0].files;

            _alwaysCallback.call(this);
            _updateCallback.call(this, getBookData(), files);
        }).on('touchend', 'button[name="cancel"]', function onCancelButtonTouchend() {
            _alwaysCallback.call(this);
            _cancelCallback.call(this);
        }).on('touchend', 'button[name="preview"]', function onPreviewButtonTouchend() {
            var book = getBookData();

            _alwaysCallback.call(this);
            _previewCallback.call(this, book.id);
        });
    }

    function addSaveEventListener(callback) {
        if (typeof callback === 'function') {
            _saveCallback = callback;
        }
    }

    function addDeleteEventListener(callback) {
        if (typeof callback === 'function') {
            _deleteCallback = callback;
        }
    }

    function addUpdateEventListener(callback) {
        if (typeof callback === 'function') {
            _updateCallback = callback;
        }
    }

    function addCancelEventListener(callback) {
        if (typeof callback === 'function') {
            _cancelCallback = callback;
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

    return {
        init: init,
        render: render,
        eventHandler: {
            addSaveEventListener: addSaveEventListener,
            addDeleteEventListener: addDeleteEventListener,
            addUpdateEventListener: addUpdateEventListener,
            addCancelEventListener: addCancelEventListener,
            addPreviewEventListener: addPreviewEventListener,
            addAlwaysEventListener: addAlwaysEventListener
        }
    };
});
