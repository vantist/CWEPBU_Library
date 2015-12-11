/* globals define: false */
define('pdf', ['jquery', 'configured_dust', 'util', 'debug'], function ($, dust, util, debug) {
    'use strict';

    var _$pdf = $('div.pdf'),
        _$image_pool = $('div.image-pool'),
        _$page_info,
        _canvas,
        _canvas_context,
        _width = _$pdf.width(),
        _height = _$pdf.height(),
        _info = {},
        _current_page = 1,
        _closeCallback = function () {},
        _nextCallback = function () {},
        _prevCallback = function () {},
        _pageChangeCallback = function () {};

    function init(path, successCallback, failCallback) {
        render(function () {
            _current_page = 1;
            _canvas = _$pdf.find('canvas')[0];
            _canvas.width = _width;
            _canvas.height = _height;
            _canvas_context = _canvas.getContext('2d');
            _$page_info = _$pdf.find('.page-info');

            util.pdf.open(
                path.replace(/^file:\/+/, '\/'),
                '',
                undefined,
                function () {
                    debug.log('pdf suc');

                    getInfo(
                        function () {
                            show();
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
                },
                function (error) {
                    debug.log('pdf error');

                    if (typeof failCallback === 'function') {
                        failCallback.call(this, error);
                    }
                }
            );
        });
    }

    function getInfo(successCallback, failCallback) {
        util.pdf.info(
            function (result) {
                _info = result;

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

    function adjustImage(image) {
        var WIDTH = 0,
            HEIGHT = 1,
            fixedBorder = (image.width > image.height) ? WIDTH : HEIGHT,
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
    function draw(image) {
        var adjustedImage = adjustImage(image);

        _canvas_context.clearRect(0, 0, _width, _height);
        _canvas_context.drawImage(image, adjustedImage.left, adjustedImage.top, adjustedImage.width, adjustedImage.height);
        renderPageInfo();
    }

    function renderPageInfo() {
        _$page_info.text(_current_page + '/' + _info.numberOfPage);
    }

    function show(callback) {
        getImage(function (image) {
            draw(image);

            if (typeof callback === 'function') {
                callback.call(this);
            }
        });
    }

    function getImage(callback) {
        var image = getImageFromPool();

        if (image === null) {
            addToImagePool(function (image) {
                callback.call(this, image);
            });
        } else {
            callback.call(this, image);
        }
    }

    function getImageFromPool() {
        var image = _$image_pool.find('img[name="' + _current_page + '"]');

        if (image.length > 0) {
            return image[0];
        }

        return null;
    }

    function addToImagePool(loadedCallback) {
        var $image = $('<img></img>'),
            interval;

        $image.on('load', function () {
            clearInterval(interval);
            if (typeof loadedCallback === 'function') {
                loadedCallback.call(this, $image[0]);
            }
        });

        util.pdf.page(
            _current_page,
            function (uri) {
                $image.attr({
                    src: uri,
                    name: _current_page
                });

                $image.appendTo(_$image_pool);

                interval = setInterval(function () {
                    draw($image[0]);
                }, 50);
            },
            function (error) {

            }
        );
    }

    function close() {
        _$image_pool.empty();
        util.pdf.close();
    }

    function render(successCallback, failCallback) {
        _$pdf.empty();
        dust.render('pdf', {}, function (err, out) {
            if (err) {
                debug.error(err);

                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            } else {
                _$pdf.append(out);

                if (typeof successCallback === 'function') {
                    successCallback.call(this);
                }
            }
        });
    }

    function next(callback) {
        if (_current_page < _info.numberOfPage) {
            _current_page += 1;
        }

        show(function () {
            if (typeof callback === 'function') {
                callback.call(this);
            }
        });
    }

    function prev(callback) {
        if (_current_page > 1) {
            _current_page -= 1;
        }

        show(function () {
            if (typeof callback === 'function') {
                callback.call(this);
            }
        });
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

            prev(function () {
                _prevCallback.call(this);
            });
        }).on('touchend', 'button.next', function pdfNextButtonTouchend() {
            _pageChangeCallback.call(this);

            next(function () {
                _nextCallback.call(this);
            });
        });
    }

    bindEvent();

    return {
        init: init,
        close: close,
        next: next,
        prev: prev,
        eventHandler: {
            addCloseEventListener: addCloseEventListener,
            addNextEventListener: addNextEventListener,
            addPrevEventListener: addPrevEventListener,
            addPageChangeEventListener: addPageChangeEventListener
        }
    };
});
