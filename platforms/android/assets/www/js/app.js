/* globals define: false, StatusBar: false */
define('app', ['jquery', 'list', 'form', 'book'], function ($, list, form, book) {
    'use strict';

    var $list = $('div.list'),
        $form = $('div.form'),
        form_create_mode = true,
        _books = [],
        _self = this;

    function refresh() {
        book.fetch(function (books) {
            _books = books;
            list.render($list, _books);
            form.refresh();
        });
    }

    function initList() {
        list.onSelectedEvent(function (event, index) {
            var data = _books[index];
            console.log('selected!!');
            data.create = false;
            form.render(undefined, data);
        });

        list.render($list, _books);
    }

    function initForm() {
        form.eventHandler.onSaveEvent(function (formData) {
            formData.id = (new Date).getTime();
            book.create(formData, function () {
                refresh();
            }, function () {
                console.error('save book error');
            });
            console.log('save book: ');
            console.dir(formData);
        });

        form.eventHandler.onDeleteEvent(function (formData) {
            book.remove(
                formData.id,
                function () {
                    console.log('remove suc');
                    refresh();
                },
                function () {
                    console.log('remove fail');
                }
            );
        });

        form.eventHandler.onUpdateEvent(function (formData) {
            book.update(
                formData.id,
                formData,
                function () {
                    console.log('update suc');
                    refresh();
                },
                function () {
                    console.log('update fail');
                }
            );
        });

        form.init();
    }

    function init() {
        StatusBar.hide();
        initList();
        initForm();
        refresh();
    }

    return {
        init: init
    };
});
