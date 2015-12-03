/* globals define: false */
define('list', ['jquery', 'dustjs'], function ($, dust) {
    'use strict';

    var _$list = $('div.list'),
        selectedCallback = function () {},
        deleteCallback = function () {},
        SELECTED_CLASSNAME = 'selected';


    function init() {
        render();
        bindEvent();
    }

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
    }

    function bindEvent() {
        // var _$tr = $(_$list.find('tbody tr'));

        _$list.on('touchstart', 'tbody', function (event) {
            var $target = $(event.target),
                $tr = $target.parent();

            if ($tr.hasClass(SELECTED_CLASSNAME)) {
                $tr.removeClass(SELECTED_CLASSNAME);
                selectedCallback.call(this, event, -1);
            } else {
                $tr.addClass(SELECTED_CLASSNAME);
                $tr.siblings().removeClass(SELECTED_CLASSNAME);

                selectedCallback.call(this, event, Number($tr.attr('idx')));
            }
        }).on('touchend', 'button.delete', function (event) {
            var id = Number($(this).attr('name'));
            console.log('list delete button touchend, id: ' + id);
            deleteCallback.call(this, event, id);
        });
    }

    function onSelectedEvent(callback) {
        if (typeof callback === 'function') {
            selectedCallback = callback;
        }
    }

    function onDeleteEvent(callback) {
        if (typeof callback === 'function') {
            deleteCallback = callback;
        }
    }

    function clearSelected() {
        $(_$list.find('.selected')).removeClass('selected');
    }

    return {
        init: init,
        render: render,
        eventHandler: {
            onSelectedEvent: onSelectedEvent,
            onDeleteEvent: onDeleteEvent
        },
        clearSelected: clearSelected
    };
});
