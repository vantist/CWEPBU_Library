/* globals define: false */
define('form', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    var _$form = $('div.form');

    function init($form) {
        _$form = $form || _$form;
        this.refresh();
    }

    function refresh() {
        this.render(_$form);
        this.bindEvent();
    }

    /**
     * @param  {jquery object} render target
     * @param  {json data} template source data
     */
    function render($form, data) {
        var _$form = $form || $('div.form'),
            data = data || {};

        dust.render('form', data, function (err, out) {
            console.log(out);

            if (err) {
                console.error(err);
            } else {
                _$form.empty().append(out);
            }
        });
    }

    function bindEvent() {
        var _$tr = $(_$form.find('tbody tr'));

        _$tr.on('touch', )
    }

    return {
        init: init,
        refresh: refresh
    };
});