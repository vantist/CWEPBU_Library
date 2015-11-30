(function () {
    'use strict';

    require.config({
        baseUrl: '',
        paths: {
            // library
            jquery: 'bower_components/jquery/dist/jquery.min',
            dust: 'bower_components/dustjs-linkedin/dist/dust-full.min',

            // module
            dustjs: 'js/dust_config'
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

    function requirejsTest() {
        require(['jquery', 'dustjs'], function ($, dustjs) {
            $('div.app').append('jquery ready<br/>');

            dustjs.render('test', {
                world: 'Jupiter'
            }, function (err, out) {
                if (err) {
                    console.error(err);
                } else {
                    $('div.app').append('dustjs ready<br/>' + out);
                }
            });
        });
    }

    var app = {
        // Application ConstructorÔ
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function () {
            app.receivedEvent('deviceready');
            requirejsTest();
        },
        // Update DOM on a Received Event
        receivedEvent: function (id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        }
    };

    app.initialize();
}());
