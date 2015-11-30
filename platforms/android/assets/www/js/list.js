/* globals define: false */
define('list', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    /**
     * @param  {jquery object} render target
     * @param  {json data} template source data
     */
    function render($list, data) {
        var _$list = $list || $('div.list');
        dust.render('list', data, function (err, out) {
            if (err) {
                console.error(err);
            } else {
                _$list.empty().append(out);
            }
        });
    }

    return {
        render: render
    };
});
