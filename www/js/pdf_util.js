/* globals
define,
PDFRenderer,
cordova
*/
define(['debug', 'env_util'], function (Debug, EnvUtil) {
    'use strict';

    function changePreference(preference) {
        PDFRenderer.changePreference(preference);
    }

    function getOpenPrefernce() {
        var preference = {
                openType: PDFRenderer.OpenType.PATH,
                quality: 100,
                encodingType: PDFRenderer.EncodingType.PNG,
                destinationType: PDFRenderer.DestinationType.FILE_URI
            };

        if (EnvUtil.isIOS()) {
            preference.customPath = cordova.file.documentsDirectory;
        }
    }

    function open(uri, password, preference) {
        var option = {
                content: uri.replace(/^file:\/+/, '\/'),
                password: password,
                openType: PDFRenderer.OpenType.PATH
            },
            promise = new Promise(function (resolve, reject) {
                PDFRenderer.open(function onPDFOpen() {
                    preference = preference || getOpenPrefernce();

                    changePreference(preference);
                    resolve();
                }, function (error) {
                    reject(error);
                }, option);
            });

        return promise;
    }

    function close() {
        try {
            PDFRenderer.close();
        } catch (e) {
            Debug.error(e);
        }
    }

    function getInfo() {
        var promise = new Promise(function (resolve, reject) {
            PDFRenderer.getPDFInfo(function onGetPDFInfo(pdfInfo) {
                Debug.log(pdfInfo.numberOfPage);
                Debug.log(pdfInfo.path);
                Debug.log(pdfInfo.name);

                resolve(pdfInfo);
            }, function (error) {
                reject(error);
            });
        });

        return promise;
    }

    function getPageInfo(page) {
        var promise = new Promise(function (resolve, reject) {
            PDFRenderer.getPageInfo(function (pageInfo) {
                Debug.log(pageInfo.numberOfPage);
                Debug.log(pageInfo.width);
                Debug.log(pageInfo.height);

                resolve(pageInfo);
            }, function (error) {
                reject(error);
            }, page);
        });

        return promise;
    }

    function getPage(page) {
        var option = {
                page: page,
                destinationType: PDFRenderer.DestinationType.FILE_URI
            },
            promise = new Promise(function (resolve, reject) {
                PDFRenderer.getPage(function (pageUrl) {
                    Debug.log('Orig FILE_URL: ' + pageUrl);

                    resolve(pageUrl);
                }, function (error) {
                    reject(error);
                }, option);
            });

        return promise;
    }

    return {
        open: open,
        close: close,
        getInfo: getInfo,
        getPageInfo: getPageInfo,
        getPage: getPage
    };
});
