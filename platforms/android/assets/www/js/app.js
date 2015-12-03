/* globals define: false, StatusBar: false */
define('app', ['jquery', 'list', 'form', 'book_service'], function ($, list, form, book_service) {
    'use strict';

    var $list = $('div.list'),
        $form = $('div.form'),
        $loading = $('div.mask'),
        _loading_status = false,
        _self = this;

    function loading(status) {
        _loading_status = status;
        if (status) {
            $loading.show();
        } else {
            $loading.hide();
        }
    }

    function refresh() {
        loading(true);
        book_service.fetch(function (books) {
            list.render($list, books, form.CREATE_MODE);
            form.refresh();
            loading(false);
        });
    }

    function initList() {
        list.eventHandler.onSelectedEvent(function (event, index) {
            var books = book_service.get();

            if (index >= 0) {
                form.render(undefined, books[index], form.EDIT_MODE);
            } else {
                form.refresh();
            }
        });

        list.eventHandler.onDeleteEvent(function (event, id) {
            loading(true);

            book_service.remove(
                id,
                function () {
                    loading(false);
                    console.log('delete suc');
                    refresh();
                },
                function () {
                    loading(false);
                    console.log('delete fail');
                    refresh();
                }
            );
        });

        list.init();
    }

    function initForm() {
        form.eventHandler.onSaveEvent(function (formData) {
            loading(true);

            formData.id = (new Date).getTime();
            book_service.create(formData, function () {
                refresh();
                loading(false);
            }, function () {
                console.error('save book error');
                refresh();
                loading(false);
            });
            console.log('save book: ');
            console.dir(formData);
        });

        form.eventHandler.onDeleteEvent(function (formData) {
            loading(true);

            book_service.remove(
                formData.id,
                function () {
                    console.log('remove suc');
                    refresh();
                    loading(false);
                },
                function () {
                    console.log('remove fail');
                    refresh();
                    loading(false);
                }
            );
        });

        form.eventHandler.onUpdateEvent(function (formData) {
            loading(true);

            book_service.update(
                formData.id,
                formData,
                function () {
                    console.log('update suc');
                    refresh();
                    loading(false);
                },
                function () {
                    console.log('update fail');
                    refresh();
                    loading(false);
                }
            );
        });

        form.eventHandler.onCancelEvent(function () {
            list.clearSelected();
            refresh();
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
