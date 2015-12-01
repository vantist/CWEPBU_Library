/* globals require: false, StatusBar: false */
require.config({
    baseUrl: '',
    paths: {
        // library
        jquery: 'bower_components/jquery/dist/jquery.min',
        dust: 'bower_components/dustjs-linkedin/dist/dust-full.min',

        // module
        dustjs: 'js/dust_config',
        app: 'js/app',
        list: 'js/list',
        form: 'js/form',
        util: 'js/util'
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
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['jquery', 'app'], function ($, app) {
    'use strict';

    $(document).ready(function () {
        app.init();
    });
});
