/* globals
define,
resolveLocalFileSystemURL,
cordova
*/
define(['debug', 'env_util'], function (Debug, EnvUtil) {
    'use strict';

    var _basePath,
        _rootDirectoryEntryPromise,
        _option = {
            readonly: {
                create: false
            },
            writable: {
                create: true,
                exclusive: false
            }
        };

    function detectEnvPath() {
        switch (EnvUtil.currentDevice) {
        case EnvUtil.device.iOS:
            _basePath = cordova.file.dataDirectory;
            break;
        case EnvUtil.device.Android:
            _basePath = cordova.file.externalDataDirectory || cordova.file.dataDirectory;
            break;
        default:
            throw 'Env util detect path error';
        }

        _rootDirectoryEntryPromise = new Promise(function (resolve, reject) {
            EnvUtil.getDeviceReadyPromise().then(function () {
                resolveLocalFileSystemURL('file:///', function (directoryEntry) {
                    resolve(directoryEntry);
                }, function (error) {
                    reject(error);
                });
            });
        }).catch(function (error) {
            Debug.log('stage rootDirectoryEntryPromise error');
            Debug.error(error);
        });
    }

    function getRootDirectoryEntry() {
        return _rootDirectoryEntryPromise;
    }

    function getBasePath() {
        return _basePath;
    }

    function createDirectory(path) {
        return getDirectoryEntry(path, _option.writable).then(function (entry) {
            return entry;
        });
    }

    function urlFilter(url) {
        return url.replace(/^file:\/+/, '');
    }

    function fileURLToCdvURI(fileURL) {
        var promise = getFileEntry(fileURL, _option.readonly);

        return promise.then(function (fileEntry) {
            return fileEntry.toInternalURL();
        });
    }

    function getDirectoryEntry(path, option) {
        var promise = new Promise(function (resolve, reject) {
            getRootDirectoryEntry().then(function (rootDirectoryEntry) {
                rootDirectoryEntry.getDirectory(
                    urlFilter(path),
                    option || _option.writable,
                    function (directoryEntry) {
                        resolve(directoryEntry);
                    },
                    function (error) {
                        reject(error);
                    });
            });
        });

        return promise;
    }


    function getFileEntry(fileName, option) {
        var promise = new Promise(function (resolve, reject) {
            Debug.log('prepare to get file entry');
            getRootDirectoryEntry().then(function (rootDirectoryEntry) {
                Debug.log('get rootDirectoryEntry done');
                rootDirectoryEntry.getFile(
                    urlFilter(fileName),
                    option || _option.readonly,
                    function (fileEntry) {
                        Debug.log('rootDirectoryEntry getFile done');
                        resolve(fileEntry);
                    },
                    function (error) {
                        Debug.log('rootDirectoryEntry getFile error');
                        reject(error);
                    });
            });
        });

        return promise;
    }

    function fileEntryToFile(fileEntry) {
        var promise = new Promise(function (resolve, reject) {
            fileEntry.file(function (file) {
                resolve(file);
            }, function (error) {
                reject(error);
            });
        });

        return promise;
    }

    function readFileToJson(file) {
        var promise = new Promise(function (resolve) {
            var reader = new FileReader();

            reader.onloadend = function () {
                var result = [];

                if (this.result) {
                    result = JSON.parse(this.result);
                }

                resolve(result);
            };
            reader.readAsText(file);
        });

        return promise;
    }

    function readToJson(fileName) {
        var fileEntryPromise = getFileEntry(fileName, _option.writable);

        return fileEntryPromise.then(function (fileEntry) {
            Debug.log(fileEntry);
            return fileEntryToFile(fileEntry);
        }).then(function (file) {
            Debug.log(file);
            return readFileToJson(file);
        });
    }

    function writeJSONToFile(fileEntry, jsonData) {
        var promise = new Promise(function (resolve, reject) {
            fileEntry.createWriter(function (fileWriter) {
                var blob = new Blob([JSON.stringify(jsonData)], {
                    type: 'text/plain'
                });

                fileWriter.onerror = function (error) {
                    reject(error);
                };

                fileWriter.onwriteend = function () {
                    if (fileWriter.length === 0) {
                        fileWriter.write(blob);
                    } else {
                        resolve();
                    }
                };

                fileWriter.truncate(0);
            });
        });

        return promise;
    }

    function writeFromJSON(fileName, data) {
        var fileEntryPromise = getFileEntry(fileName, _option.writable);

        return fileEntryPromise.then(function (fileEntry) {
            return writeJSONToFile(fileEntry, data);
        });
    }

    function copyFile(targetFileEntry, sourceFile) {
        var promise = new Promise(function (resolve, reject) {
            targetFileEntry.createWriter(function (fileWriter) {
                var blob = sourceFile.slice(0, sourceFile.size);

                fileWriter.onerror = function (error) {
                    reject(error);
                };

                fileWriter.onwriteend = function () {
                    if (fileWriter.length === 0) {
                        fileWriter.write(blob);
                    } else {
                        resolve(targetFileEntry.toURI());
                    }
                };

                fileWriter.truncate(0);
            });
        });

        return promise;
    }

    function writeFromFile(fileName, sourceFile) {
        var fileEntryPromise = getFileEntry(fileName, _option.writable);

        return fileEntryPromise.then(function (fileEntry) {
            return copyFile(fileEntry, sourceFile);
        });
    }

    function removeFile(fileEntry) {
        var promise = new Promise(function (resolve, reject) {
            fileEntry.remove(function removeFileSucc(entry) {
                resolve(entry);
            }, function removeFileFail(error) {
                reject(error);
            });
        });

        return promise;
    }

    function remove(fileName) {
        var fileEntryPromise = getFileEntry(fileName, _option.writable);

        return fileEntryPromise.then(function (fileEntry) {
            return removeFile(fileEntry);
        });
    }

    detectEnvPath();

    return {
        fileURLToCdvURI: fileURLToCdvURI,
        getFileEntry: getFileEntry,
        readToJson: readToJson,
        writeFromJSON: writeFromJSON,
        remove: remove,
        writeFromFile: writeFromFile,
        getBasePath: getBasePath,
        createDirectory: createDirectory
    };
});
