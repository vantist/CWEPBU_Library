/* globals define: false */
define('list', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    var _$list = $('div.list');

    /**
     * @param  {jquery object} render target
     * @param  {json data} template source data
     */
    function render($list, data) {
        $list = $list || _$list;
        dust.render('list', data, function (err, out) {
            if (err) {
                console.error(err);
            } else {
                $list.empty().append(out);
            }
        });

        bindEvent();
    }

    function bindEvent() {
        // var _$tr = $(_$list.find('tbody tr'));

        _$list.on('touchstart', 'tbody', function (event) {
            var $target = $(event.target),
                $tr = $target.parent();

            $tr.addClass('selected');
            $tr.siblings().removeClass('selected');
        });
    }

    return {
        render: render
    };
});
