/* globals define: false */
define('form', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

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

    return {
        render: render
    };
});