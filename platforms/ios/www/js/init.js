/* globals
require
*/
require.config({
    baseUrl: '',
    paths: {
        // library
        jquery: 'bower_components/jquery/dist/jquery.min',
        dust: 'bower_components/dustjs-linkedin/dist/dust-full.min',

        // module
        configured_dust: 'js/configured_dust',
        app: 'js/app',
        list_controller: 'js/list_controller',
        form_controller: 'js/form_controller',
        file_util: 'js/file_util',
        pdf_util: 'js/pdf_util',
        book_service: 'js/book_service',
        pdf_controller: 'js/pdf_controller',
        debug: 'js/debug',
        loading_mask_controller: 'js/loading_mask_controller',
        env_util: 'js/env_util'
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

require(['jquery', 'app'], function ($, App) {
    'use strict';

    // document.addEventListener('deviceready', function () {
    //     console.log('device ready!');
    //     App.init();
    // }, false);


    $(document).ready(
        function onDucomentReady() {
        App.init();
    });
});
