APP.applicationController = (function () {
	'use strict';

	function start() {
		$('body').innerText = "Start!";
	}

	return {
		start: start
	};
}());