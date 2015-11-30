/* globals define: false */
define('app', ['jquery', 'list', 'form'], function ($, list, form) {
    'use strict';

    var $list = $('div.list'),
        $form = $('div.form');

    function init() {
        this.renderList([{
            title: '測試',
            category: '類別',
            author: '作者',
            isbn: '1578612315347',
            link: '123456.pdf'
        }, {
            title: '測試1',
            category: '類別1',
            author: '作者1',
            isbn: '1578614442315347',
            link: '32412.pdf'
        }, {
            title: '測試3',
            category: '類別2',
            author: '作者4',
            isbn: '1578612315347',
            link: ''
        }, {
            title: '測試7',
            category: '類別5',
            author: '作者',
            isbn: '15786efw12315347',
            link: '12345dsf6.pdf'
        }, {
            title: '測試',
            category: '類別',
            author: '作者',
            isbn: '1578612315347',
            link: '123456.pdf'
        }, {
            title: '測試',
            category: '類別',
            author: '作者',
            isbn: '1578612315347',
            link: '123456.pdf'
        }]);

        this.renderForm();
    }

    function renderList(data) {
        list.render($list, data);
    }

    function renderForm() {
        form.render($form, {});
    }

    return {
        init: init,
        renderList: renderList,
        renderForm: renderForm
    };
});
