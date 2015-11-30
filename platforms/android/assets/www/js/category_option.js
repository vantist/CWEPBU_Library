/* globals define: false */
define('category_option', ['dustjs'], function (dust) {
	'use strict';

	var $form = $('div.form');

	function render($elements, data) {
		var _$elements = $elements || $form;

		dust.render('category_option', data, function (err, out) {
			if (err) {
				console.error(err);
			} else {
				_$elements.empty().append(out);
			}
		});
	}

	return {
		render: render
	};
});