/* globals
define,
FileTransfer,
PDFRenderer,
cordova,
resolveLocalFileSystemURL,
Blob,
console
*/
define('util', [], function () {
    'use strict';
    var fileTransfer = new FileTransfer();

    function checkDirectory(path, callback) {
        getDirectoryEntry(
            path, {
                create: true
            },
            function () {
                if (typeof callback === 'function') {
                    callback.call(this);
                }
            }
        );
    }

    function toInternalURL(fileURL, successCallback) {
        resolveLocalFileSystemURL(fileURL, function (entry) {
            console.log('cdvfile URI: ' + entry.toInternalURL());

            if (typeof successCallback === 'function') {
                successCallback.call(this, entry.toInternalURL());
            }
        });
    }

    function getDirectoryEntry(path, option, callback) {
        resolveLocalFileSystemURL(path, function (dir) {
            option = option || {};
            dir.getDirectory('', option, function (entry) {
                if (typeof callback === 'function') {
                    callback.call(this, entry);
                }
            });
        });
    }


    function getFileEntry(path, file_name, option, callback) {
        resolveLocalFileSystemURL(path, function (dir) {
            option = option || {};
            dir.getFile(file_name, option, function (entry) {
                if (typeof callback === 'function') {
                    callback.call(this, entry);
                }
            });
        });
    }

    function read(path, file_name) {
        var promise = new Promise(function (resolve, reject) {
            checkDirectory(path, function () {
                getFileEntry(
                    path,
                    file_name, {
                        create: true
                    },
                    function (entry) {
                        entry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function (e) {
                                var result = [];

                                if (this.result) {
                                    result = JSON.parse(this.result);
                                }

                                resolve(result);
                            };

                            reader.readAsText(file);
                        }, function (error) {
                            console.error(error);
                            reject(error);
                        });
                    }
                );
            });
        });

        return promise;
    }

    function write(path, file_name, data, writeendCallback, failCallback) {
        checkDirectory(path, function () {
            getFileEntry(
                path,
                file_name, {
                    create: true
                },
                function (entry) {
                    entry.createWriter(function (fileWriter) {
                        var blob = new Blob([JSON.stringify(data)], {
                            type: 'text/plain'
                        });

                        if (typeof failCallback === 'function') {
                            fileWriter.onerror = failCallback;
                        }

                        fileWriter.onwriteend = function () {
                            if (fileWriter.length === 0) {
                                fileWriter.write(blob);
                            } else {
                                if (typeof writeendCallback === 'function') {
                                    writeendCallback.call(this);
                                }
                            }
                        };

                        fileWriter.truncate(0);
                    });
                }
            );
        });
    }

    function writeWithFile(path, file_name, file, writeendCallback, failCallback) {
        var startTime = (new Date()).getTime();

        checkDirectory(path, function () {
            getFileEntry(
                path,
                file_name, {
                    create: true
                },
                function (entry) {
                    entry.createWriter(function (fileWriter) {
                        var blob = file.slice(0, file.size);

                        if (typeof failCallback === 'function') {
                            fileWriter.onerror = failCallback;
                        }

                        fileWriter.onwriteend = function () {
                            if (fileWriter.length === 0) {
                                fileWriter.write(blob);
                            } else {
                                if (typeof writeendCallback === 'function') {
                                    writeendCallback.call(this, entry.toURI());
                                    console.log('write time:', (new Date()).getTime() - startTime, 'ms');
                                }
                            }
                        };

                        fileWriter.truncate(0);
                    });
                }
            );
        });
    }

    function remove(path, file_name, successCallback, failCallback) {
        checkDirectory(path, function () {
            getFileEntry(
                path,
                file_name, {
                    create: false,
                    exclusive: false
                },
                function (entry) {
                    entry.remove(function (entry) {
                        console.log("Removal succeeded");

                        if (typeof successCallback === 'function') {
                            successCallback.call(this, entry);
                        }
                    }, function (error) {
                        console.error("Error removing file: " + error.code);

                        if (typeof failCallback === 'function') {
                            failCallback.call(this, error);
                        }
                    });
                }
            );
        });
    }

    function download(uri, fileURL, successCallback, failCallback) {
        fileTransfer.download(uri, fileURL, function (entry) {
            console.log("download complete: " + entry.toURL());
            if (typeof successCallback === 'function') {
                successCallback.call(this, entry);
            }
        }, function (error) {
            console.error("download error source " + error.source);
            console.error("download error target " + error.target);
            console.error("upload error code" + error.code);
            if (typeof failCallback === 'function') {
                failCallback.call(this, error);
            }
        });
    }

    function downloadWithURL(uri, fileURL, successCallback, failCallback) {
        download(encodeURI(uri), fileURL, successCallback, failCallback);
    }

    function downloadWithFileURL(uri, fileURL, successCallback, failCallback) {
        toInternalURL(uri, function (internalURL) {
            download(internalURL, fileURL, successCallback, failCallback);
        });
    }

    function openWithNative(uri, mine_type, successCallback, failCallback) {
        cordova.plugins.fileOpener2.open(
            uri,
            mine_type, {
                error: function () {
                    console.log('error');

                    if (typeof failCallback === 'function') {
                        failCallback.call(this);
                    }
                },
                success: function () {
                    console.log('succ');

                    if (typeof successCallback === 'function') {
                        successCallback.call(this);
                    }
                }
            }
        );
    }

    function openWithPDF(uri, password, preference, successCallback, failCallback) {
        var option = {
            content: uri.replace(/^file:\/+/, "\/"),
            password: password,
            openType: PDFRenderer.OpenType.PATH
        };

        PDFRenderer.open(function (result) {
            preference = preference || {
                openType: PDFRenderer.OpenType.PATH,
                quality: 100,
                encodingType: PDFRenderer.EncodingType.PNG,
                destinationType: PDFRenderer.DestinationType.FILE_URI,
                destinationPath: ''
            };

            PDFRenderer.changePreference(preference);

            if (typeof successCallback === 'function') {
                successCallback.call(this, result);
            }
        }, function (error) {
            if (typeof failCallback === 'function') {
                failCallback.call(this, error);
            }
        }, option);
    }

    function closePDF() {
        try {
            PDFRenderer.close();
        } catch (e) {
            console.error(e);
        }
    }

    function getPDFInfo(successCallback, failCallback) {
        PDFRenderer.getPDFInfo(function (result) {
            console.log(result.numberOfPage);
            console.log(result.path);
            console.log(result.name);

            if (typeof successCallback === 'function') {
                successCallback.call(this, result);
            }
        }, function (error) {
            console.error(error);

            if (typeof failCallback === 'function') {
                failCallback.call(this, error);
            }
        });
    }

    function getPDFPageInfo(page, successCallback, failCallback) {
        PDFRenderer.getPageInfo(function (result) {
            console.log(result.numberOfPage);
            console.log(result.width);
            console.log(result.height);

            if (typeof successCallback === 'function') {
                successCallback.call(this, result);
            }
        }, function (error) {
            console.error(error);

            if (typeof failCallback === 'function') {
                failCallback.call(this, error);
            }
        }, page);
    }

    function getPDFPage(page, successCallback, failCallback) {
        var option = {
            page: page,
            destinationType: PDFRenderer.DestinationType.FILE_URI
        };

        PDFRenderer.getPage(function (result) {
            console.log('Orig FILE_URL: ' + result);

            if (typeof successCallback === 'function') {
                successCallback.call(this, 'file://' + result);
            }
        }, function (error) {
            console.error(error);

            if (typeof failCallback === 'function') {
                failCallback.call(this, error);
            }
        }, option);
    }

    return {
        file: {
            download: download,
            downloadWithFileURL: downloadWithFileURL,
            downloadWithURL: downloadWithURL,
            openWithNative: openWithNative,
            toInternalURL: toInternalURL,
            getFileEntry: getFileEntry,
            read: read,
            write: write,
            remove: remove,
            writeWithFile: writeWithFile
        },
        pdf: {
            open: openWithPDF,
            close: closePDF,
            info: getPDFInfo,
            pageInfo: getPDFPageInfo,
            page: getPDFPage
        }
    };
});
