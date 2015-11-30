define(['jquery', 'dust'], function ($, dust) {
	// disable cache
	dust.config.cache = false;

	// dust override onload
	dust.onLoad = function (template, callback) {
		$.get('templates/' + template + '.dust', function (data) {
			callback(undefined, data);
		}).fail(function (err) {
			console.error('dust load error');
			callback(err, undefined);
		});
	}

	return dust;
});