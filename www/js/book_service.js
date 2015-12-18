/* globals
define
*/
define(['file_util', 'debug'], function (FileUtil, Debug) {
    'use strict';

    var BOOKS_FILE = 'list.json',
        BOOKS_FOLDER = 'book/',
        _booksBasePath,
        _books = [];

    function init() {
        _booksBasePath = FileUtil.getBasePath() + BOOKS_FOLDER;

        FileUtil.createDirectory(_booksBasePath).then(function () {
            Debug.log('check & create directory done');
            Debug.log('start checking books file exist or not');

            return fetchAll();
        }).catch(function (error) {
            Debug.error('check & create directory error');
            Debug.error(error);
        });
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

    function save() {
        return FileUtil.writeFromJSON(_booksBasePath + BOOKS_FILE, _books);
    }

    /**
     * create(book, pdfFile[file list])
     */
    function create(book, pdfFiles) {
        var fileName = (pdfFiles.length === 0) ? null : book.id + '.pdf',
            promise;

        book.filename = fileName;
        _books.push(convertBookData(book));

        if (fileName) {
            promise = FileUtil.writeFromFile(
                _booksBasePath + fileName,
                pdfFiles[0]
            ).then(function () {
                return save();
            });
        } else {
            promise = save();
        }

        return promise;
    }

    function fetchAll() {
        var readPromise = FileUtil.readToJson(_booksBasePath + BOOKS_FILE);
        Debug.log('fetch All starting');

        return readPromise.then(function fetchAllBooks(books) {
            Debug.log(books);
            _books = books;
            return _books;
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
     * update(book, pdfFile[file list])
     */
    function update(book, pdfFiles) {
        var fileName = (pdfFiles === undefined || pdfFiles.length === 0) ? null : book.id + '.pdf',
            promise;

        book.filename = book.filename || fileName;
        updateBook(book.id, book);

        if (fileName) {
            promise = FileUtil.writeFromFile(
                _booksBasePath + fileName,
                pdfFiles[0]
            ).then(function () {
                return save();
            });
        } else {
            promise = save();
        }

        return promise;
    }

    function remove(id) {
        var index = indexOfById(id);
        _books.splice(index, 1);

        return save();
    }

    function removePDF(id) {

        var index = indexOfById(id),
            fileName = _books[index].filename;

        return FileUtil.remove(
            _booksBasePath + fileName
        ).then(function () {
            _books[index].filename = null;
            return update(_books[index]);
        });
    }

    init();

    return {
        get: function () {
            return _books;
        },
        contains: contains,
        fetchAll: fetchAll,
        remove: remove,
        update: update,
        create: create,
        removePDF: removePDF,
        indexOfById: indexOfById,
        getBooksFolder: function () {
            return _booksBasePath;
        }
    };
});
