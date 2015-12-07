/* globals define: false */
define('form', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    var _$form = $('div.form'),
        _self = this,
        saveCallback = function () {},
        deleteCallback = function () {},
        updateCallback = function () {},
        cancelCallback = function () {},
        previewCallback = function () {},
        CREATE_MODE = true,
        EDIT_MODE = false;

    function init($form) {
        _$form = $form || _$form;
        refresh();
        bindEvent();
    }

    function refresh() {
        render(_$form, {}, CREATE_MODE);
    }

    /**
     * @param  {jquery object} render target
     * @param  {json data} template source data
     */
    function render($form, data, type) {
        var _$form = $form || $('div.form');

        dust.render(
            'form', {
                create: type,
                book: data
            },
            function (err, out) {

                if (err) {
                    console.error(err);
                } else {
                    _$form.empty().append(out);
                }
            }
        );
    }

    function getFormData() {
        var data = {
            id: Number(_$form.find('input[name="id"]').val()),
            title: _$form.find('input[name="title"]').val(),
            isbn: _$form.find('input[name="isbn"]').val(),
            filename: _$form.find('input[name="filename"]').val()
        };

        return data;
    }

    function bindEvent() {
        _$form.on('touchend', 'button[name="save"]', function () {
            console.log('touchend save button');
            saveCallback.call(this, getFormData(), _$form.find('input[type="file"]')[0]);
        }).on('touchend', 'button[name="clear"]', function () {
            console.log('touchend clear button');
        }).on('touchend', 'button[name="delete"]', function () {
            console.log('touchend delete button');
            deleteCallback.call(this, getFormData());
        }).on('touchend', 'button[name="update"]', function () {
            console.log('touchend update button');
            updateCallback.call(this, getFormData(), _$form.find('input[type="file"]')[0]);
        }).on('touchend', 'button[name="cancel"]', function () {
            console.log('touchend cancel button');
            cancelCallback.call(this);
        }).on('touchend', 'button[name="preview"]', function () {
            console.log('touchend preview button');
            previewCallback.call(this, getFormData());
        });
    }

    function onSaveEvent(callback) {
        if (typeof callback === 'function') {
            saveCallback = callback;
        }
    }

    function onDeleteEvent(callback) {
        if (typeof callback === 'function') {
            deleteCallback = callback;
        }
    }

    function onUpdateEvent(callback) {
        if (typeof callback === 'function') {
            updateCallback = callback;
        }
    }

    function onCancelEvent(callback) {
        if (typeof callback === 'function') {
            cancelCallback = callback;
        }
    }

    function onPreviewEvent(callback) {
        if (typeof callback === 'function') {
            previewCallback = callback;
        }
    }

    return {
        init: init,
        refresh: refresh,
        render: render,
        eventHandler: {
            onSaveEvent: onSaveEvent,
            onDeleteEvent: onDeleteEvent,
            onUpdateEvent: onUpdateEvent,
            onCancelEvent: onCancelEvent,
            onPreviewEvent: onPreviewEvent
        },
        CREATE_MODE: CREATE_MODE,
        EDIT_MODE: EDIT_MODE
    };
});
