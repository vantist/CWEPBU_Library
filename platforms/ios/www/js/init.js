/* globals
require
*/
require.config({
    baseUrl: '',
    paths: {
        // library
        jquery: 'bower_components/jquery/dist/jquery.min',
        dust: 'bower_components/configured_dust-linkedin/dist/dust-full.min',

        // module
        configured_dust: 'js/configured_dust',
        app: 'js/app',
        list: 'js/list',
        form: 'js/form',
        util: 'js/util',
        book_service: 'js/book_service',
        pdf: 'js/pdf',
        dubug: 'js/dubug'
    },
    shim: {
        jquery: {
            deps: [],
            exports: '$'
        },
        dust: {
            deps: [],
            exports: 'dust'
        }
    },
    urlArgs: 'bust=' + new Date().getTime()
});

require(['jquery', 'app'], function ($, app) {
    'use strict';

    $(document).ready(function onDucomentReady() {
        app.init();
    });
});
