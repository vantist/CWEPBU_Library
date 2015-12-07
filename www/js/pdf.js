/* globals define: false */
define('pdf', ['jquery', 'dustjs', 'util'], function ($, dust, util) {
    'use strict';

    var _$element = $('div.pdf'),
        _$image_pool = $('div.image-pool'),
        _width = _$element.width(),
        _height = _$element.height(),
        _pdf_path = '',
        _info = {},
        _current_page = 1,
        closeCallback = function () {},
        nextCallback = function () {},
        prevCallback = function () {},
        pageChangeCallback = function () {};

    console.log('pdf width', _width);
    console.log('pdf height', _height);

    function init(path, successCallback, failCallback) {
        render(function () {
            _current_page = 1;
            var canvas = _$element.find('canvas')[0];
            canvas.width = _width,
            canvas.height = _height;

            util.pdf.open(
                path.replace(/^file:\/+/, "\/"),
                '',
                undefined,
                function (result) {
                    console.log('pdf suc');

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
                    console.log('pdf error');

                    if (typeof failCallback === 'function') {
                        failCallback.call(this, error);
                    }
                }
            )
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

    function draw(image) {
        var canvas = _$element.find('canvas')[0],
            context = canvas.getContext("2d"),
            $page_info = _$element.find('.page-info'),
            scaleHeight = image.height * _width / image.width,
            top = (_height - scaleHeight) / 2;

        context.clearRect(0, 0, _width, _height);
        context.drawImage(image, 0, top, _width, scaleHeight);
        $page_info.text(_current_page + '/' + _info.numberOfPage);
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
        _$element.empty();
        dust.render('pdf', {}, function (err, out) {
            if (err) {
                console.error(err);

                if (typeof failCallback === 'function') {
                    failCallback.call(this);
                }
            } else {
                _$element.append(out);

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

    function onCloseEvent(callback) {
        if (typeof closeCallback === 'function') {
            closeCallback = callback;
        }
    }

    function onNextEvent(callback) {
        if (typeof nextCallback === 'function') {
            nextCallback = callback;
        }
    }

    function onPrevEvent(callback) {
        if (typeof prevCallback === 'function') {
            prevCallback = callback;
        }
    }

    function onPageChangeEvent(callback) {
        if (typeof pageChangeCallback === 'function') {
            pageChangeCallback = callback;
        }
    }

    function bindEvent() {
        _$element.on('touchend', 'button.close', function () {
            close();
            closeCallback.call(this);
        }).on('touchend', 'button.prev', function () {
            pageChangeCallback.call(this);
            prev(function () {
                prevCallback.call(this);
            });
        }).on('touchend', 'button.next', function () {
            pageChangeCallback.call(this);
            next(function () {
                nextCallback.call(this);
            });
        });
    }

    bindEvent();

    function auto() {
        next(function () {
            if (_current_page !== 349) {
                auto();
            }
        });
    }

    return {
        init: init,
        close: close,
        next: next,
        prev: prev,
        eventHandler: {
            onCloseEvent: onCloseEvent,
            onNextEvent: onNextEvent,
            onPrevEvent: onPrevEvent,
            onPageChangeEvent: onPageChangeEvent
        },
        auto: auto
    };
});
