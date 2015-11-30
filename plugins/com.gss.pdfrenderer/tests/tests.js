
exports.defineAutoTests = function() {
    var shouldNotBeSucceed = function(done) {
        expect(false).toBe(true);
        done();
    }
    var shouldNotBeFailed = function(done) {
        expect(true).toBe(false);
        done();
    }
    var openFileObj = {
        content: '/storage/emulated/0/Download/PDFRendererTest.pdf',
        password: '1234'
    };

    describe('PDFRenderer', function() {
        it('should exist', function() {
            expect(PDFRenderer).toBeDefined();
        });
    });

    describe('PDFRenderer.open', function() {
        it('should exist', function() {
            expect(PDFRenderer.open).toBeDefined();
            expect(typeof PDFRenderer.open == 'function').toBe(true);
        });

        it('should return error when file requires passwrod', function(done) {
            var obj = {
                content: openFileObj.content
            };
            var fail = function(data) {
                expect(data).toBe('The PDF needs password.');
                done();
            };
            PDFRenderer.open(shouldNotBeSucceed.bind(done), fail, obj);
        });

        it('should return error witch user gave wrong password', function(done) {
            var obj = {
                content: openFileObj.content,
                password: '123'
            };
            var fail = function(data) {
                expect(data).toContain('Password incorrect.');
                done();
            };
            PDFRenderer.open(shouldNotBeSucceed.bind(done), fail, obj);
        });

        it('should return PDFInfo', function(done) {
            var success = function(data) {
                expect(data.numberOfPage).toBe(8);
                expect(data.path).toBe(openFileObj.content);
                expect(data.name).toBe('PDFRendererTest');
                PDFRenderer.close(null, null);
                done();
            };
            PDFRenderer.open(success, shouldNotBeFailed.bind(done), openFileObj);
        });
    });

    describe('PDFRenderer.close', function() {
        it('should exist', function() {
            expect(PDFRenderer.close).toBeDefined();
            expect(typeof PDFRenderer.close == 'function').toBe(true);
        });
    });

    describe('PDFRenderer.getPageInfo', function() {
        it('should exist', function() {
            expect(PDFRenderer.getPageInfo).toBeDefined();
            expect(typeof PDFRenderer.getPageInfo == 'function').toBe(true);
        });
        
        it('should return error when no file was opened', function(done) {
            PDFRenderer.close(null, null);
            var shouldOpenAFile = function(data) {
                expect(data).toBe('Please open a file.');
                done();
            };
            PDFRenderer.getPageInfo(shouldNotBeSucceed.bind(done), shouldOpenAFile);
        });

        it('should return Page Info', function(done) {
            var success = function(data) {
                expect(data.numberOfPage).toBeGreaterThan(0);
                expect(data.width).toBeGreaterThan(0);
                expect(data.height).toBeGreaterThan(0);
                PDFRenderer.close(null, null);
                done();
            }
            PDFRenderer.open(function() {
                PDFRenderer.getPageInfo(success, shouldNotBeFailed.bind(done));         // no given argus, should has default value
            }, null, openFileObj);
        });

        it('should return Page Info with given page', function(done) {
            var success = function(data) {
                expect(data.numberOfPage).toBeGreaterThan(0);
                expect(data.width).toBeGreaterThan(0);
                expect(data.height).toBeGreaterThan(0);
                PDFRenderer.close(null, null);
                done();
            }
            PDFRenderer.open(function() {
                PDFRenderer.getPageInfo(success, shouldNotBeFailed.bind(done), 0);
            }, null, openFileObj);
        });

        // it('should return Page Info with over page number', function(done) {
        //     var success = function(data) {
        //         expect(data.numberOfPage).toBeGreaterThan(0);
        //         expect(data.width).toBeGreaterThan(0);
        //         expect(data.height).toBeGreaterThan(0);
        //         PDFRenderer.close(null, null);
        //         done();
        //     }
        //     PDFRenderer.open(function() {
        //         PDFRenderer.getPageInfo(success, shouldNotBeFailed.bind(done)), 1000);  // the value is greater then pdf's page, should return last page
        //     }, null, openFileObj);
        // });
    });

    describe('PDFRenderer.getPDFInfo', function(done) {
        it('should exist', function() {
            expect(PDFRenderer.getPDFInfo).toBeDefined();
            expect(typeof PDFRenderer.getPDFInfo == 'function').toBe(true);
        });

        it('should return error when no file was opened', function(done) {
            PDFRenderer.close(null, null);
            var shouldOpenAFile = function(data) {
                expect(data).toBe('Please open a file.');
                done();
            };
            PDFRenderer.getPDFInfo(shouldNotBeSucceed.bind(done), shouldOpenAFile);
        });

        it('should return PDF Info', function(done) {
            var success = function(data) {
                expect(data.numberOfPage).toBeGreaterThan(0);
                expect(data.path).toBe(openFileObj.content);
                expect(data.name).toBe('PDFRendererTest');
                PDFRenderer.close(null, null);
                done();
            }
            PDFRenderer.open(function() {
                PDFRenderer.getPDFInfo(success, shouldNotBeFailed.bind(done));
            }, null, openFileObj);
        });
    });

    describe('PDFRenderer.getPage', function() {
        it('should exist', function() {
            expect(PDFRenderer.getPage).toBeDefined();            
            expect(typeof PDFRenderer.getPage == 'function').toBe(true);
        });

        it('should return error when no file was opened', function(done) {
            PDFRenderer.close(null, null);
            var shouldOpenAFile = function(data) {
                expect(data).toBe('Please open a file.');
                done();
            }
            PDFRenderer.getPage(shouldNotBeSucceed.bind(done), shouldOpenAFile);
        });

        it('should return picture path', function(done) {
            var success = function(data) {
                expect(data).toContain('/files/PDFRendererTest/0.jpeg');
                PDFRenderer.close(null, null); 
                done();
            }
            PDFRenderer.open(function() {
                var obj = { 
                    destinationType: PDFRenderer.DestinationType.FILE_URI
                }
                PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
            }, null, openFileObj);
        });

        it('should return picture path which give a destinationPath', function(done) {
            var success = function(data) {
                expect(data).toContain('/files/Zam/PDFName/0.jpeg');
                PDFRenderer.close(null, null); 
                done();
            }
            PDFRenderer.open(function() {
                var obj = { 
                    destinationType: PDFRenderer.DestinationType.FILE_URI,
                    destinationPath: '/Zam/PDFName/'
                }
                PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
            }, null, openFileObj);
        });

        // it('should return picture path which give a default destinationPath', function(done) {
        //     var success = function(data) {
        //         expect(data).toContain('/storage/emulated/0/Android/data/');
        //         expect(data).toContain('/files/PDFRenderer/Zam/PDFName/0.jpeg');
        //         PDFRenderer.close(null, null); 
        //         done();
        //     }
        //     PDFRenderer.open(function() {
        //         var obj = { 
        //             destinationType: PDFRenderer.DestinationType.FILE_URI
        //         }
        //         PDFRenderer.changePreference(function() {
        //             PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
        //         }, null, { destinationPath: '/Zam/PDFName/' });
        //     }, null, openFileObj);
        // });

        it('should return picture path which give a default destinationPath', function(done) {
            var success = function(data) {
                expect(data).toContain('/files/Zam/PDFName/0.jpeg');    

                PDFRenderer.changePreference({ destinationPath: '' });         
                PDFRenderer.close(null, null); 
                done();
            }
            PDFRenderer.open(function() {
                var obj = { 
                    destinationType: PDFRenderer.DestinationType.FILE_URI
                }
                PDFRenderer.changePreference({ destinationPath: '/Zam/PDFName/' });
                PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
            }, null, openFileObj);
        });
        // it('should return picture path which give a default destinationPath', function(done) {
        //     var success = function(data) {
        //         expect(data).toContain('/storage/emulated/0/Android/data/');
        //         expect(data).toContain('/files/PDFRenderer/Zam/PDFName/0.jpeg');
        //         PDFRenderer.close(null, null); 
        //         done();
        //     }
        //     PDFRenderer.open(function() {
        //         var obj = { 
        //             destinationType: PDFRenderer.DestinationType.FILE_URI
        //         }
        //         PDFRenderer.changePreference(function() {
        //             PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
        //         }, null, { destinationPath: '/Zam/PDFName/' });
        //     }, null, openFileObj);
        // });

        it('should return data binary (arraybuffer)', function(done) {
            var success = function(data) {
                expect(typeof data == 'object').toBe(true);
                expect(data.byteLength > 0).toBe(true);
                PDFRenderer.close(null, null); 
                done();
            }
            PDFRenderer.open(function() {
                var obj = { 
                    destinationType: PDFRenderer.DestinationType.DATA_BIN 
                }
                PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
            }, null, openFileObj);
        });

        it('should return data url (base64 string)', function(done) {
            var success = function(data) {
                expect(typeof data == 'string').toBe(true);
                expect(data.length > 0).toBe(true);
                PDFRenderer.close(null, null);
                done();
            }
            PDFRenderer.open(function() {
                var obj = {
                    destinationType: PDFRenderer.DestinationType.DATA_URL 
                }
                PDFRenderer.getPage(success, shouldNotBeFailed.bind(done), obj);
            }, null, openFileObj);
        });
    });

    describe('PDFRenderer.changePreference', function() {
        it('should exist', function() {
            expect(PDFRenderer.changePreference).toBeDefined();
            expect(typeof PDFRenderer.changePreference == 'function').toBe(true);
        });

        it('should has default value', function(done) {
            var success = function(data) {
            }

            PDFRenderer.open(function() {
                var data = PDFRenderer.changePreference();
                expect(data.destinationType).toBe(PDFRenderer.DestinationType.DATA_BIN);
                expect(data.openType).toBe(PDFRenderer.OpenType.PATH);
                expect(data.encodingType).toBe(PDFRenderer.EncodingType.JPEG);
                expect(data.quality).toBe(100);
                expect(data.destinationPath).toBe('');
                done();
            }, null, openFileObj);
        });

        it('should change the default value', function(done) {
            var obj = {
                quality: 50,
                destinationPath: '/Zam/PDFName/'
            };

            PDFRenderer.open(function() {
                var data = PDFRenderer.changePreference(obj);
                expect(data.destinationType).toBe(PDFRenderer.DestinationType.DATA_BIN);
                expect(data.openType).toBe(PDFRenderer.OpenType.PATH);
                expect(data.encodingType).toBe(PDFRenderer.EncodingType.JPEG);
                expect(data.quality).toBe(obj.quality);
                expect(data.destinationPath).toBe(obj.destinationPath);

                PDFRenderer.changePreference({ quality: 100, destinationPath: '' });
                PDFRenderer.close(null, null);
                done();
            }, null, openFileObj);
        });

        // it('should has default value', function(done) {
        //     var success = function(data) {
        //         expect(data.destinationType).toBe(PDFRenderer.DestinationType.DATA_BIN);
        //         expect(data.openType).toBe(PDFRenderer.OpenType.PATH);
        //         expect(data.encodingType).toBe(PDFRenderer.EncodingType.JPEG);
        //         expect(data.quality).toBe(100);
        //         expect(data.destinationPath).toBe('');
        //         done();
        //     }

        //     PDFRenderer.open(function() {
        //         PDFRenderer.changePreference(success, shouldNotBeFailed.bind(done));
        //     }, null, openFileObj);
        // });

        // it('should change the default value', function(done) {
        //     var success = function(data) {
        //         expect(data.destinationType).toBe(PDFRenderer.DestinationType.DATA_BIN);
        //         expect(data.openType).toBe(PDFRenderer.OpenType.PATH);
        //         expect(data.encodingType).toBe(PDFRenderer.EncodingType.JPEG);
        //         expect(data.quality).toBe(obj.quality);
        //         expect(data.destinationPath).toBe(obj.destinationPath);
        //         PDFRenderer.close(null, null);
        //         done();
        //     }
        //     var obj = {
        //         quality: 50,
        //         destinationPath: '/Zam/PDFName/'
        //     };

        //     PDFRenderer.open(function() {
        //         PDFRenderer.changePreference(success, shouldNotBeFailed.bind(done), obj);
        //     }, null, openFileObj);
        // });
    });
};
