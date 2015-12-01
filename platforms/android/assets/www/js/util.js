/* globals define: false, FileTransfer: false, PDFRenderer: false, cordova: false, resolveLocalFileSystemURL: false */
define('util', [], function () {
    'use strict';
    var fileTransfer = new FileTransfer();

    function toInternalURL(fileURL, successCallback) {
        resolveLocalFileSystemURL(fileURL, function (entry) {
            console.log('cdvfile URI: ' + entry.toInternalURL());

            if (typeof successCallback === 'function') {
                successCallback.call(this, entry.toInternalURL());
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

    function openWithNative(uri, mine_type, successCallback, failCallback) {
        cordova.plugins.fileOpener2.open(
            uri,
            mine_type,
            {
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
            content: uri,
            password: password,
            openType: PDFRenderer.OpenType.PATH
        };

        PDFRenderer.open(function (result) {
            preference = preference || {
                openType: PDFRenderer.OpenType.PATH,
                quality: 100,
                encodingType: PDFRenderer.EncodingType.PNG,
                destinationType: PDFRenderer.DestinationType.DATA_URL,
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
        }

        PDFRenderer.getPage(function (result) {
            console.log('DataURL: ' + result);

            if (typeof successCallback === 'function') {
                successCallback.call(this, result);
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
            toInternalURL: toInternalURL
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
