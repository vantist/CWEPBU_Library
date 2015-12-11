/* globals
define
 */
define(['jquery', 'dust', 'debug'], function ($, dust, debug) {
	'use strict';

	// disable cache
	dust.config.cache = false;

	// dust override onload
	dust.onLoad = function dustOnLoadEvent(template, callback) {
		$.get('templates/' + template + '.dust', function (data) {
			callback(undefined, data);
		}).fail(function (err) {
			debug.error('dust load error');
			callback(err, undefined);
		});
	};

	return dust;
});