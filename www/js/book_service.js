/* globals define: false */
define('book_service', ['util'], function (util) {
    'use strict';

    var book_list_path = cordova.file.externalDataDirectory + 'books/';
    var list_file = 'list.json';
    var _books = [];

    function convertBookData(data) {
        var define_attr = ['id', 'title', 'isbn', 'link'],
        obj = {};

        for (var i in define_attr) {
            var attr = define_attr[i];
            obj[attr] = data[attr];
        }

        return obj;
    }

    function create(data, successCallback, failCallback) {
        if (data !== undefined) {
            _books.push(convertBookData(data));
        }

        util.file.remove(
            book_list_path,
            list_file,
            function (entry) {
                util.file.write(
                    book_list_path,
                    list_file,
                    _books,
                    function () {
                        console.log('added book to list');

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
                _books = list;

                console.log('fetch done.');
                console.log(_books);

                if (typeof callback === 'function') {
                    callback.call(this, list);
                }
            },
            function (error) {
                console.log('fetch list error');
            }
        );
    }

    function getBookIndexWithId(id) {
        id = Number(id);

        for (var i = _books.length - 1; i >= 0; i--) {
            if (_books[i].id === id) {
                break;
            }
        }

        return i;
    }

    function checkExist(id) {
        if (getBookIndexWithId(id) >= 0) {
            return true;
        }

        return false;
    }

    function updateBook(id, data) {
        var index = getBookIndexWithId(id);

        if (index >= 0) {
            _books[index] = convertBookData(data);
        }
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
    }

    function remove(id, successCallback, failCallback) {
        var index = getBookIndexWithId(id);
        _books.splice(index, 1);

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
    }

    function get() {
        return _books;
    }

    function set(books) {
        _books = books;
    }

    function uploadPDF() {

    }

    function removePDF() {

    }

    return {
        checkExist: checkExist,
        fetch: fetch,
        get: get,
        set: set,
        remove: remove,
        update: update,
        create: create,
        uploadPDF: uploadPDF,
        removePDF: removePDF
    };
});
