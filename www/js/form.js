/* globals define: false */
define('form', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    var _$form = $('div.form');

    function init($form) {
        _$form = $form || _$form;
        refresh();
    }

    function refresh() {
        render(_$form);
        bindEvent();
    }

    /**
     * @param  {jquery object} render target
     * @param  {json data} template source data
     */
    function render($form, data) {
        var _$form = $form || $('div.form'),
            data = data || {
                create: true
            };

        dust.render('form', data, function (err, out) {
            console.log(out);

            if (err) {
                console.error(err);
            } else {
                _$form.empty().append(out);
            }
        });

        bindEvent();
    }

    function bindEvent() {
    }

    return {
        init: init,
        refresh: refresh,
        render: render
    };
});