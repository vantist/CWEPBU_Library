/* globals
define,
StatusBar
*/
define('app', ['jquery', 'list', 'form', 'book_service', 'pdf', 'debug'], function ($, list, form, bookService, pdf, debug) {
    'use strict';

    var $list = $('div.list'),
        $form = $('div.form'),
        $pdf = $('div.pdf'),
        $loading = $('div.mask');

    function showLoadingMask() {
        $loading.show();
    }

    function hideLoadingMask() {
        $loading.hide();
    }

    function refresh() {
        list.render(bookService.get());
        form.render();
        hideLoadingMask();
    }

    function initList() {
        list.eventHandler.addAlwaysEventListener(function () {
            showLoadingMask();
        });

        list.eventHandler.addSelectedEventListener(function (id) {
            var books = bookService.get(),
                index = bookService.indexOfById(id),
                book = (index !== -1) ? books[index] : undefined;

            form.render(book);
        });

        list.eventHandler.addDeleteEventListener(function (id) {
            bookService.remove(
                id,
                function () {
                    debug.log('delete suc');
                    refresh();
                },
                function () {
                    debug.log('delete fail');
                    refresh();
                }
            );
        });

        list.eventHandler.addPreviewEventListener(function (id) {
            var books = bookService.get(),
                index = bookService.indexOfById(id),
                book = books[index],
                pdf_path = bookService.getBooksPath() + book.filename;

            pdf.init(
                pdf_path,
                function () {
                    debug.log('open pdf succ');
                    hideLoadingMask();
                },
                function () {
                    debug.log('open pdf fail');
                    hideLoadingMask();
                }
            );
        });

        list.init($list);
    }

    function initForm() {
        form.eventHandler.addAlwaysEventListener(function formAlwaysEvent() {
            showLoadingMask();
        });

        form.eventHandler.addSaveEventListener(function (book, files) {
            book.id = (new Date()).getTime();

            bookService.create(
                book,
                files,
                function appFormSaveBookSucc() {
                    refresh();
                },
                function appFormSaveBookFail() {
                    refresh();
                });
        });

        form.eventHandler.addDeleteEventListener(function (id) {
            bookService.removePDF(
                id,
                function appFormDeletePDFSucc() {
                    refresh();
                },
                function appFormDeletePDFFail() {
                    refresh();
                }
            );
        });

        form.eventHandler.addUpdateEventListener(function (book, files) {
            bookService.update(
                book,
                files,
                function appFormUpdateSucc() {
                    refresh();
                },
                function appFormUpdateFail() {
                    refresh();
                }
            );
        });

        form.eventHandler.addCancelEventListener(function () {
            list.clearSelected();
            refresh();
        });

        form.eventHandler.addPreviewEventListener(function (id) {
            var books = bookService.get(),
                index = bookService.indexOfById(id),
                book = books[index],
                pdf_path = bookService.getBooksPath() + book.filename;

            pdf.init(
                pdf_path,
                function appInitPDFSucc() {
                    hideLoadingMask();
                },
                function appInitPDFFail() {
                    hideLoadingMask();
                }
            );
        });

        form.init($form);
    }

    function initPDF() {
        pdf.eventHandler.addCloseEventListener(function () {});

        pdf.eventHandler.addNextEventListener(function () {
            hideLoadingMask();
        });

        pdf.eventHandler.addPrevEventListener(function () {
            hideLoadingMask();
        });

        pdf.eventHandler.addPageChangeEventListener(function () {
            showLoadingMask();
        });

        pdf.init($pdf);
    }

    function init() {
        var fetchPromise = bookService.fetchAll();
        StatusBar.hide();

        fetchPromise.then(function appFetchAllBooks() {
            initList();
            initForm();
            initPDF();
        }).catch(function appFetchAllBooksError(error) {
            debug.error(error);
        });
    }

    return {
        init: init
    };
});
