/* globals define: false, StatusBar: false */
define('app', ['jquery', 'list', 'form', 'book_service', 'pdf'], function ($, list, form, book_service, pdf) {
    'use strict';

    var $list = $('div.list'),
        $form = $('div.form'),
        $loading = $('div.mask'),
        $progress = $('progress'),
        $pdf = $('div.pdf'),
        pdf_mode = false,
        _self = this;

    function loading(status) {
        show_progress(false);
        if (status) {
            $loading.show();
        } else {
            $loading.hide();
        }
    }

    function show_pdf(status) {
        pdf_mode = status;
        if (pdf_mode) {
            $pdf.show();
        } else {
            $pdf.hide();
        }
    }

    function show_progress(status, num) {
        if (status) {
            $progress.show().val(num);
        } else {
            $progress.hide();
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

        list.eventHandler.onPreviewEvent(function (event, filename) {
            show_pdf(true);
            loading(true);


            var pdf_path = book_service.getBookPath() + filename;
            console.log(pdf_path);

            pdf.init(
                pdf_path,
                function () {
                    console.log('open pdf succ');
                    loading(false);
                },
                function () {
                    console.log('open pdf fail');
                    loading(false);
                }
            );
        });

        list.init();
    }

    function initForm() {
        form.eventHandler.onSaveEvent(function (formData, file) {
            loading(true);
            formData.id = (new Date()).getTime();

            if (file.files.length === 0) {
                book_service.create(formData, function () {
                    refresh();
                    loading(false);
                }, function () {
                    console.error('save book error');
                    refresh();
                    loading(false);
                });
            } else {
                book_service.createWithPDF(
                    formData,
                    file,
                    function () {
                        refresh();
                        loading(false);
                    },
                    function () {
                        console.error('save book error');
                        refresh();
                        loading(false);
                    },
                    function (percentage) {
                        if (percentage !== 100) {
                            show_progress(true, percentage);
                        } else {
                            show_progress(false);
                        }
                    },
                    function (percentage) {
                        if (percentage !== 100) {
                            show_progress(true, percentage);
                        } else {
                            show_progress(false);
                        }
                    }
                );
            }
        });

        form.eventHandler.onDeleteEvent(function (formData) {
            loading(true);

            book_service.removePDF(
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

        form.eventHandler.onUpdateEvent(function (formData, file) {
            loading(true);

            if (file && file.files.length !== 0) {
                book_service.updateWithPDF(
                    formData,
                    file,
                    function () {
                        console.log('update with pdf suc');
                        refresh();
                        loading(false);
                    },
                    function () {
                        console.log('update with pdf fail');
                        refresh();
                        loading(false);
                    },
                    function (percentage) {
                        if (percentage !== 100) {
                            show_progress(true, percentage);
                        } else {
                            show_progress(false);
                        }
                    },
                    function (percentage) {
                        if (percentage !== 100) {
                            show_progress(true, percentage);
                        } else {
                            show_progress(false);
                        }
                    }
                );
            } else {
                book_service.update(
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
            }

        });

        form.eventHandler.onCancelEvent(function () {
            list.clearSelected();
            refresh();
        });

        form.eventHandler.onPreviewEvent(function (formData) {
            show_pdf(true);
            loading(true);

            var pdf_path = book_service.getBookPath() + formData.filename;
            console.log(pdf_path);

            pdf.init(
                pdf_path,
                function () {
                    console.log('open pdf succ');
                    loading(false);
                },
                function () {
                    console.log('open pdf fail');
                    loading(false);
                }
            );
        });

        form.init();
    }

    function initPDF() {
        pdf.eventHandler.onCloseEvent(function () {
            show_pdf(false);
        });

        pdf.eventHandler.onNextEvent(function () {
            loading(false);
        });

        pdf.eventHandler.onPrevEvent(function () {
            loading(false);
        });

        pdf.eventHandler.onPageChangeEvent(function () {
            loading(true);
        });
    }

    function init() {
        StatusBar.hide();
        show_pdf(false);
        initList();
        initForm();
        initPDF();
        refresh();
    }

    return {
        init: init
    };
});
