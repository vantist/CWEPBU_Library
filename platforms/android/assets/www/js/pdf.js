/* globals define: false */
define('pdf', ['jquery', 'dustjs'], function ($, dust) {
	'use strict';

	var _$element = $('div.pdf');

	function render($element, data) {
		$element = $element || _$element;

		dust.render($element, data, function (err, out) {
			if (err) {
				console.error(err);
			} else {
				$element.empty().append(out);
			}
		});
	}
});