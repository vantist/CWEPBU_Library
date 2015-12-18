/* globals
define
 */
define(['jquery', 'dust', 'debug'], function ($, Dust, Debug) {
	'use strict';

	// disable cache
	Dust.config.cache = false;

	// dust override onload
	Dust.onLoad = function dustOnLoadEvent(template, callback) {
		$.get('templates/' + template + '.dust', function (data) {
			callback(undefined, data);
		}).fail(function (err) {
			Debug.error('dust load error');
			callback(err, undefined);
		});
	};

	return Dust;
});