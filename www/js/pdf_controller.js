/* globals
define
*/
define(['jquery', 'configured_dust', 'pdf_util', 'debug', 'book_service'], function ($, Dust, PDFUtil, Debug, BookService) {
    'use strict';

    var _$pdf = $('div.pdf'),
        _$imagePool,
        _$pageInfo,
        _canvas,
        _canvasContext,
        _width = _$pdf.width(),
        _height = _$pdf.height(),
        _info = {},
        _currentPageNum = 1,
        _closeCallback = function () {},
        _nextCallback = function () {},
        _prevCallback = function () {},
        _pageChangeCallback = function () {},
        PDF_TEMPLATE = 'pdf';

    function detectBorderSize() {
        _width = _$pdf.width();
        _height = _$pdf.height();
        _canvas.width = _width;
        _canvas.height = _height;
    }

    function render() {
        var promise = new Promise(function pdfRenderPromise(resolve, reject) {
            Dust.render(PDF_TEMPLATE, {}, function pdfDustRender(err, out) {
                if (err) {
                    reject(err);
                } else {
                    _$pdf.empty().append(out);
                    resolve();
                }
            });
        });

        return promise;
    }

    function open(path) {
        return PDFUtil.open(
            BookService.getBooksFolder() + path,
            '',
            undefined
        ).then(function pdfOpen() {
            return getInfo();
        }).then(function pdfGetInfo() {
            _$pdf.show();
            return drawPDF();
        });
    }



    function init($pdf) {
        _$pdf = $pdf;

        render().then(function pdfRenderDone() {
            _currentPageNum = 1;
            _canvas = _$pdf.find('canvas')[0];
            detectBorderSize();
            _canvasContext = _canvas.getContext('2d');
            _$pageInfo = _$pdf.find('.page-info');
            _$imagePool = _$pdf.find('.image-pool');
        });

        bindEvent();
    }

    function getInfo() {
        return PDFUtil.getInfo().then(function pdfGetInfo(info) {
            _info = info;
            return info;
        });
    }

    function adjustImage(image) {
        var WIDTH = 0,
            HEIGHT = 1,
            fixedBorder = (image.width / image.height > _width / _height) ? WIDTH : HEIGHT,
            adjustedImage = {
                top: 0,
                left: 0,
                width: _width,
                height: _height
            };

        switch (fixedBorder) {
        case WIDTH:
            adjustedImage.height = image.height * _width / image.width;
            adjustedImage.top = (_height - adjustedImage.height) / 2;
            break;
        case HEIGHT:
            adjustedImage.width = image.width * _height / image.height;
            adjustedImage.left = (_width - adjustedImage.width) / 2;
            break;
        }

        return adjustedImage;
    }

    // canvas draw image from image element
    function drawImage(image) {
        var adjustedImage = adjustImage(image);

        clearCanvas();
        _canvasContext.drawImage(image, adjustedImage.left, adjustedImage.top, adjustedImage.width, adjustedImage.height);
        renderPageInfo();
    }

    function renderPageInfo() {
        _$pageInfo.text(_currentPageNum + '/' + _info.numberOfPage);
    }

    function clearCanvas() {
        _canvasContext.clearRect(0, 0, _width, _height);
    }

    function drawPDF() {
        return getImage().then(function pdfGetImage(image) {
            detectBorderSize();
            drawImage(image);
            return;
        });
    }

    function getImage() {
        var promise = Promise.resolve().then(function pdfGetImagePromise() {
            var image = getImageFromPool();

            if (image !== null) {
                return image;
            }

            return addImageToPool().then(function pdfAddImageToPool(image) {
                return image;
            });
        });

        return promise;
    }

    function getImageFromPool() {
        var image = _$imagePool.find('img[name="' + _currentPageNum + '"]');

        if (image.length > 0) {
            return image[0];
        }

        return null;
    }

    function addImageToPool() {
        var promise = new Promise(function pdfAddImageToPoolPromise(resolve) {
            return PDFUtil.getPage(_currentPageNum).then(function pdfGetPage(uri) {
                var $image = $('<img></img>');

                $image.on('load', function onImageLoad() {
                    resolve($image[0]);
                });

                $image.attr({
                    src: uri,
                    name: _currentPageNum
                });

                $image.appendTo(_$imagePool);
            });
        });

        return promise;
    }

    function close() {
        clearCanvas();
        _$imagePool.empty();
        _$pdf.hide();
        _currentPageNum = 1;
        PDFUtil.close();
    }

    function next() {
        if (_currentPageNum < _info.numberOfPage) {
            _currentPageNum += 1;
        }

        return drawPDF();
    }

    function prev() {
        if (_currentPageNum > 1) {
            _currentPageNum -= 1;
        }

        return drawPDF();
    }

    function addCloseEventListener(callback) {
        if (typeof _closeCallback === 'function') {
            _closeCallback = callback;
        }
    }

    function addNextEventListener(callback) {
        if (typeof _nextCallback === 'function') {
            _nextCallback = callback;
        }
    }

    function addPrevEventListener(callback) {
        if (typeof _prevCallback === 'function') {
            _prevCallback = callback;
        }
    }

    function addPageChangeEventListener(callback) {
        if (typeof _pageChangeCallback === 'function') {
            _pageChangeCallback = callback;
        }
    }

    function bindEvent() {
        _$pdf.on('touchend', 'button.close', function pdfCloseButtonTouchend() {
            close();
            _closeCallback.call(this);
        }).on('touchend', 'button.prev', function pdfPrevButtonTouchend() {
            _pageChangeCallback.call(this);

            prev().then(function onPrev() {
                _prevCallback.call(this);
            });
        }).on('touchend', 'button.next', function pdfNextButtonTouchend() {
            _pageChangeCallback.call(this);

            next().then(function onNext() {
                _nextCallback.call(this);
            });
        });

        $(window).on('resize', function pdfResize() {
            detectBorderSize();
            drawPDF();
        });
    }

    return {
        init: init,
        open: open,
        close: close,
        eventHandler: {
            addCloseEventListener: addCloseEventListener,
            addNextEventListener: addNextEventListener,
            addPrevEventListener: addPrevEventListener,
            addPageChangeEventListener: addPageChangeEventListener
        }
    };
});
