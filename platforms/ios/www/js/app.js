/* globals
define,
StatusBar
*/
define('app', ['jquery', 'list_controller', 'form_controller', 'book_service', 'pdf_controller', 'debug', 'loading_mask_controller'], function ($, ListController, FormController, BookService, PDFController, Debug, LoadingMaskController) {
    'use strict';

    var _$list = $('div.list'),
        _$form = $('div.form'),
        _$pdf = $('div.pdf'),
        _$loading = $('div.mask');

    function refresh() {
        ListController.render(BookService.get());
        FormController.render();
        LoadingMaskController.hide();
    }

    function initList() {
        ListController.eventHandler.addAlwaysEventListener(function () {
            LoadingMaskController.show();
        });

        ListController.eventHandler.addSelectedEventListener(function (id) {
            var books = BookService.get(),
                index = BookService.indexOfById(id),
                book = (index !== -1) ? books[index] : undefined;

            FormController.render(book);
            LoadingMaskController.hide();
        });

        ListController.eventHandler.addDeleteEventListener(function (id) {
            BookService.remove(id).then(function () {
                refresh();
            }).catch(function (error) {
                Debug.error('list delete error');
                Debug.error(error);
            }).then(function () {
                LoadingMaskController.hide();
            });
        });

        ListController.eventHandler.addPreviewEventListener(function (id) {
            var books = BookService.get(),
                index = BookService.indexOfById(id),
                book = books[index],
                pdfPath = book.filename;

            PDFController.open(pdfPath).then(function () {
                LoadingMaskController.hide();
            });
        });

        ListController.init(_$list);
    }

    function initForm() {
        FormController.eventHandler.addAlwaysEventListener(function formAlwaysEvent() {
            LoadingMaskController.show();
        });

        FormController.eventHandler.addSaveEventListener(function (book, files) {
            book.id = (new Date()).getTime();

            BookService.create(book, files).then(function () {
                refresh();
            }).catch(function (error) {
                Debug.error('create error');
                Debug.error(error);
            }).then(function () {
                LoadingMaskController.hide();
            });
        });

        FormController.eventHandler.addDeleteEventListener(function (id) {
            BookService.removePDF(id).then(function () {
                refresh();
            }).then(function () {
                LoadingMaskController.hide();
            }).catch(function (error) {
                Debug.error('delete error');
                Debug.error(error);
            });
        });

        FormController.eventHandler.addUpdateEventListener(function (book, files) {
            BookService.update(book, files).then(function () {
                refresh();
            }).then(function () {
                LoadingMaskController.hide();
            }).catch(function (error) {
                Debug.error('update error');
                Debug.error(error);
            });
        });

        FormController.eventHandler.addCancelEventListener(function () {
            ListController.clearSelected();
            refresh();
        });

        FormController.eventHandler.addPreviewEventListener(function (id) {
            var books = BookService.get(),
                index = BookService.indexOfById(id),
                book = books[index],
                pdfPath = book.filename;

            PDFController.open(pdfPath).then(function () {
                LoadingMaskController.hide();
            });
        });

        FormController.init(_$form);
    }

    function initPDF() {
        PDFController.eventHandler.addCloseEventListener(function () {});

        PDFController.eventHandler.addNextEventListener(function () {
            LoadingMaskController.hide();
        });

        PDFController.eventHandler.addPrevEventListener(function () {
            LoadingMaskController.hide();
        });

        PDFController.eventHandler.addPageChangeEventListener(function () {
            LoadingMaskController.show();
        });

        PDFController.init(_$pdf);
    }

    function initLoadingMask() {
        LoadingMaskController.init(_$loading);
    }

    function init() {
        StatusBar.hide();
        initList();
        initForm();
        initPDF();
        initLoadingMask();

        LoadingMaskController.show();
        BookService.fetchAll().then(function appFetchAllBooks() {
            ListController.render(BookService.get());
        }).catch(function appFetchAllBooksError(error) {
            Debug.error('fetchAll error');
            Debug.error(error);
        }).then(function () {
            LoadingMaskController.hide();
        });
    }

    return {
        init: init
    };
});
