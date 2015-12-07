/* globals define: false */
define('book_service', ['util'], function (util) {
    'use strict';

    var base_path = cordova.file.externalDataDirectory || cordova.file.applicationStorageDirectory,
        book_list_path = base_path + 'books/',
        list_file = 'list.json',
        _books = [];

    console.log('base_path:', base_path);
    console.log('book_list_path:', book_list_path);

    function convertBookData(data) {
        var define_attr = ['id', 'title', 'isbn', 'filename'],
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
    }

    function fetch(callback) {
        console.log('fetch start');
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

    function update(data, successCallback, failCallback) {
        updateBook(data.id, data);

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

    function createWithPDF(data, file, successCallback, failCallback, readingProgressCallback, writingProgressCallback) {
        var fileName = data.id + '.pdf';
        data.filename = fileName;

        util.file.writeWithFile(
            book_list_path,
            fileName,
            file.files[0],
            function (uri) {
                create(data, successCallback, failCallback);
            },
            function () {
                console.error('create with pdf fail');
            },
            function (percentage) {
                console.log('writing file:', percentage, '%');

                if (typeof writingProgressCallback === 'function') {
                    writingProgressCallback.call(this, percentage);
                }
            }
        );
    }

    function updateWithPDF(data, file, successCallback, failCallback, readingProgressCallback, writingProgressCallback) {
        var filename = data.id + '.pdf';
        data.filename = filename;

        util.file.writeWithFile(
            book_list_path,
            filename,
            file.files[0],
            function (uri) {
                update(data, successCallback, failCallback);
            },
            function () {
                console.error('create with pdf fail');
            },
            function (percentage) {
                console.log('writing file:', percentage, '%');

                if (typeof writingProgressCallback === 'function') {
                    writingProgressCallback.call(this, percentage);
                }

            }

        );
    }

    function removePDF(id, successCallback, failCallback) {

        var index = getBookIndexWithId(id),
            filename = _books[index].filename;
        util.file.remove(
            book_list_path,
            filename,
            function (entry) {
                console.log('remove pdf succ', filename);

                delete _books[index].filename;

                update(
                    _books[index],
                    function () {
                        if (typeof successCallback === 'function') {
                            successCallback.call(this);
                        }
                    },
                    function () {
                        console.log('remove pdf fail, update data stage');
                        if (typeof failCallback === 'function') {
                            failCallback.call(this);
                        }
                    }
                );
            },
            function (error) {
                console.log('remove pdf fail', filename);
                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            }
        );
    }

    function getBookPath() {
        return book_list_path;
    }

    function openPDF(id, successCallback, failCallback) {
        var index = getBookIndexWithId(id),
            book = _books[index];

        console.log('try to open file:',book_list_path + book.filename,'it\'s a pdf file');
        util.pdf.open(
            book_list_path + book.filename,
            '',
            undefined,
            function (result) {
                if (typeof successCallback === 'function') {
                    successCallback.call(this, result);
                }
            },
            function (error) {
                if (typeof failCallback === 'function') {
                    failCallback.call(this, error);
                }
             }
        );
    }

    function getPDFInfo() {

    }

    return {
        checkExist: checkExist,
        fetch: fetch,
        get: get,
        set: set,
        remove: remove,
        update: update,
        updateWithPDF: updateWithPDF,
        create: create,
        createWithPDF: createWithPDF,
        removePDF: removePDF,
        getBookPath: getBookPath,
        openPDF: openPDF,
        getPDFInfo: getPDFInfo
    };
});
