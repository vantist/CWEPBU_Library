/* globals define: false */
define('form', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    var _$form = $('div.form'),
        _self = this,
        saveCallback = function () {},
        deleteCallback = function () {},
        updateCallback = function () {},
        cancelCallback = function () {},
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
            id: _$form.find('input[name="id"]').val(),
            title: _$form.find('input[name="title"]').val(),
            isbn: _$form.find('input[name="isbn"]').val()
        };

        return data;
    }

    function bindEvent() {
        _$form.on('touchend', 'button[name="save"]', function () {
            console.log('touchend save button');
            saveCallback.call(this, getFormData());
        }).on('touchend', 'button[name="clear"]', function () {
            console.log('touchend clear button');
        }).on('touchend', 'button[name="delete"]', function () {
            console.log('touchend delete button');
            deleteCallback.call(this, getFormData());
        }).on('touchend', 'button[name="update"]', function () {
            console.log('touchend update button');
            updateCallback.call(this, getFormData());
        }).on('touchend', 'button[name="cancel"]', function () {
            console.log('touchend cancel button');
            cancelCallback.call(this);
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

    return {
        init: init,
        refresh: refresh,
        render: render,
        eventHandler: {
            onSaveEvent: onSaveEvent,
            onDeleteEvent: onDeleteEvent,
            onUpdateEvent: onUpdateEvent,
            onCancelEvent: onCancelEvent
        },
        CREATE_MODE: CREATE_MODE,
        EDIT_MODE: EDIT_MODE
    };
});
