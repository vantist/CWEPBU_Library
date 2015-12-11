/* globals
define,
cordova
*/
define('book_service', ['util', 'debug'], function (util, debug) {
    'use strict';

    var _basePath,
        _bookListPath,
        BOOKS_FILE = 'list.json',
        BOOKS_FOLDER = 'book',
        _books = [];

    function init() {
        detectEnvPath();
    }

    function detectEnvPath() {
        _basePath = cordova.file.externalDataDirectory || cordova.file.applicationStorageDirectory;
        _bookListPath = _basePath + '/' + BOOKS_FOLDER;
    }

    function convertBookData(data) {
        var defineAttr = ['id', 'title', 'isbn', 'filename'],
            obj = {};

        for (var i in defineAttr) {
            var attr = defineAttr[i];
            obj[attr] = data[attr];
        }

        return obj;
    }

    function save(successCallback, failCallback) {
        util.file.write(
            _bookListPath,
            BOOKS_FILE,
            _books,
            function () {
                if (typeof successCallback === 'function') {
                    successCallback.call(this);
                }
            },
            function (error) {
                debug.error(error);

                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            }
        );
    }

    /**
     * create(book, pdfFile[file list], sucCallback, failCallback)
     */
    function create(book, pdfFiles, successCallback, failCallback) {
        var fileName = (pdfFiles.length === 0) ? null : book.id + '.pdf';

        book.filename = fileName;
        _books.push(convertBookData(book));

        if (pdfFiles.length !== 0) {
            util.file.writeWithFile(
                _bookListPath,
                fileName,
                pdfFiles[0],
                function createBookWithPDFSuccess() {
                    save(successCallback, failCallback);
                },
                function createBookWithPDFFail() {
                    debug.error('create with pdf fail');
                }
            );
        } else {
            save(successCallback, failCallback);
        }
    }

    function fetchAll() {
        debug.log('fetch start');

        var readPromise = util.file.read(_bookListPath, BOOKS_FILE);

        return readPromise.then(function fetchAllBooks(books) {
            _books = books;

            debug.log('fetch done.');
            debug.log(_books);
            return _books;
        }).catch(function fetchAllBooksError(error) {
            debug.error('fetch list error');
            debug.error(error);
            return error;
        });
    }

    function indexOfById(id) {
        id = Number(id);
        for (var i = _books.length - 1; i >= 0; i--) {
            if (_books[i].id === id) {
                return i;
            }
        }

        return -1;
    }

    function contains(id) {
        return indexOfById(id) >= 0;
    }

    function updateBook(id, data) {
        var index = indexOfById(id);

        if (index >= 0) {
            _books[index] = convertBookData(data);
        }
    }

    /**
     * update(book, pdfFile[file list], successCallback, failCallback)
     */
    function update(book, pdfFiles, successCallback, failCallback) {
        var fileName = (pdfFiles.length === 0) ? null : book.id + '.pdf';

        book.filename = fileName;
        updateBook(book.id, book);

        if (pdfFiles.length !== 0) {
            util.file.writeWithFile(
                _bookListPath,
                fileName,
                pdfFiles[0],
                function updateBookWithPDFSucc() {
                    save(successCallback, failCallback);
                },
                function updateBookWithPDFFail() {
                    debug.error('update with pdf fail');
                }
            );
        } else {
            save(successCallback, failCallback);
        }
    }

    function remove(id, successCallback, failCallback) {
        var index = indexOfById(id);
        _books.splice(index, 1);

        save(function updateBookSuccess() {
                if (typeof successCallback === 'function') {
                    successCallback.call(this);
                }
            },
            function updateBookFail() {
                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            });
    }

    function get() {
        return _books;
    }

    function set(books) {
        _books = books;
    }

    function removePDF(id, successCallback, failCallback) {

        var index = indexOfById(id),
            filename = _books[index].filename;

        util.file.remove(
            _bookListPath,
            filename,
            function () {
                debug.log('remove pdf succ', filename);

                _books[index].filename = null;

                update(
                    _books[index],
                    function () {
                        if (typeof successCallback === 'function') {
                            successCallback.call(this);
                        }
                    },
                    function () {
                        debug.log('remove pdf fail, update data stage');
                        if (typeof failCallback === 'function') {
                            failCallback.call(this);
                        }
                    }
                );
            },
            function (error) {
                debug.error(error);
                debug.log('remove pdf fail', filename);
                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            }
        );
    }

    function getBooksPath() {
        return _bookListPath;
    }

    function openPDF(id, successCallback, failCallback) {
        var index = indexOfById(id),
            book = _books[index];

        debug.log('try to open file:', _bookListPath + book.filename, 'it\'s a pdf file');

        util.pdf.open(
            _bookListPath + book.filename,
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

    init();

    return {
        contains: contains,
        fetchAll: fetchAll,
        get: get,
        set: set,
        remove: remove,
        update: update,
        create: create,
        removePDF: removePDF,
        getBooksPath: getBooksPath,
        openPDF: openPDF,
        getPDFInfo: getPDFInfo,
        indexOfById: indexOfById
    };
});
