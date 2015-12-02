/* globals define: false */
define('book', ['util'], function (util) {
    'use strict';

    var book_list_path = cordova.file.externalDataDirectory + 'books/';
    var list_file = 'list.json';
    var books = [];

    function create(data, successCallback, failCallback) {
        if (data !== undefined) {
            books.push(data);
        }

        util.file.remove(
            book_list_path,
            list_file,
            function (entry) {
                util.file.write(
                    book_list_path,
                    list_file,
                    books,
                    function () {
                        console.log('added book to list');
                        console.log('data: ' + data);

                        if (typeof successCallback === 'function') {
                            successCallback.call(this);
                        }
                    },
                    function (error) {
                        console.log('add book error');
                        console.error(error);

                        if (typeof failCallback === 'function') {
                            failCallback.call(this);
                        }
                    }
                );
            },
            function (error) {
                console.error('create fail on remove stage');

                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            }
        );
    }

    function fetch(callback) {
        util.file.read(
            book_list_path,
            list_file,
            function (list) {
                books = list;

                if (typeof callback === 'function') {
                    callback.call(this, list);
                }
            },
            function (error) {
                console.log('fetch list error');
            }
        );
    }

    function getBookWithId(id, successCallback, failCallback) {
        var result;

        for (var i = books.length - 1; i >= 0; i--) {
            if (books[i].id === id) {
                result = books[i];
                break;
            }
        }

        return i;
    }

    function checkExist(id) {
        if (getBookWithId(id) >= 0) {
            return true;
        }

        return false;
    }

    function updateBook(id, data) {
        var index = getBookWithId(id);
        books[index] = data;
    }

    function update(id, data, successCallback, failCallback) {
        updateBook(id, data);
        create(
            undefined,
            function () {
                if (typeof successCallback === 'function') {
                    successCallback.call(this);
                }
            },
            function () {
                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            }
        );
        // util.file.remove(
        //     book_list_path,
        //     list_file,
        //     function (entry) {
        //         if (id !== undefined) {
        //             updateBook(id, data);
        //         }
        //         create();
        //     },
        //     function (error) {
        //         console.error('update fail on remove stage');
        //     }
        // );
    }

    function remove(id, successCallback, failCallback) {
        var index = getBookWithId(id);
        books = books.splice(index, 1);
        update(
            undefined,
            undefined,
            function () {
                if (typeof successCallback === 'function') {
                    successCallback.call(this);
                }
            },
            function () {
                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            }
        );
    }

    function uploadPDF() {

    }

    function removePDF() {

    }

    return {
        checkExist: checkExist,
        fetch: fetch,
        remove: remove,
        update: update,
        create: create,
        uploadPDF: uploadPDF,
        removePDF: removePDF
    };
});
